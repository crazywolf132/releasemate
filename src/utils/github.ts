/**
 * This is used to access the GitHub API
 * and perform tasks related to the releases
 */

import { memoize, get } from 'lodash';
import { Octokit } from '@octokit/rest';
import pRetry from 'p-retry';
import Bottleneck from 'bottleneck';
import HttpProxyAgent from 'http-proxy-agent';
import HttpsProxyAgent from 'https-proxy-agent';
import type { Dict, SharedInformation } from '@types';

const SKIP_RETRY_CODES = new Set([401, 403, 404, 422]);
const RETRY_CONF: Dict<number> = { retries: 3, factor: 2, minTimeout: 1000 };

/**
 * Rate limit per API endpoints.
 * 
 * See {@link https://developer.github.com/v3/search/#rate-limit|Search API rate limit}.
 * See {@link https://developer.github.com/v3/#rate-limiting|Core API rate limit}.
 */
const RATE_LIMITS: Dict<number | Dict<number>> = {
    search: ((60 * 1000) / 30) * 1.1, // 30 calls per minute => 1 call every 2s + 10% safety margin
    core: {
        read: ((60 * 60 * 1000) / 5000) * 1.1, // 5000 calls per hour => 1 call every 0.72s + 10% safety margin
        write: 3000, // 1 call every 3 seconds
    }
};

/**
 * Global rate limit to prevent abuse.
 * 
 * See {@link https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits|Dealing with abuse rate limits}.
 */
const GLOBAL_RATE_LIMIT = 1000; // 1 call every second

const getThrottler = memoize((rate: any, globalThrottler: any) => new Bottleneck({ minTime: get(RATE_LIMITS, rate) as number }).chain(globalThrottler));

const createGithubClient = async ({ githubToken, proxy }: { githubToken: any; proxy: any }) => {
    const baseURL = '';
    const globalThrottler = new Bottleneck({ minTime: GLOBAL_RATE_LIMIT });
    const github = new Octokit({
        auth: `token ${githubToken}`,
        baseUrl: `https://github.aus.thenational.com.au/api/v3`,
        request: {
            // @ts-ignore
            agent: proxy ? baseURL && new URL(baseURL).protocol === 'http:' ? new HttpProxyAgent(proxy) : new HttpsProxyAgent(proxy) : undefined
        }
    })

    github.hook.wrap('request', (request: any, options: any): any => {
        const access = options.method === 'GET' ? 'read' : 'write';
        const rateCategory = options.url.startsWith('/search') ? 'search' : 'core';

        // @ts-ignore
        const limitKey: string = [rateCategory, RATE_LIMITS[rateCategory][access] && access].filter(Boolean).join('.');

        return pRetry(async () => {
            try {
                // @ts-ignore
                return await getThrottler(limitKey, globalThrottler).wrap(request)(options);
            } catch (error: any) {
                if (SKIP_RETRY_CODES.has(error.status)) {
                    // @ts-ignore
                    throw new pRetry.AbortError(error);
                }
                throw error;
            }
        }, RETRY_CONF)
    });

    return github;
}

export class GithubAPI {
    private static _instance: GithubAPI;

    private github: Octokit | null = null;

    private constructor() { }

    public async init() {
        this.github = await createGithubClient({ githubToken: process.env.GH_TOKEN ?? '', proxy: undefined });
    }

    public static get instance(): GithubAPI {
        if (!this._instance) {
            this._instance = new GithubAPI();
        }
        return this._instance
    }

    public async createGithubRelease(changelog: string, tagName: string, sharedInformation: SharedInformation) {
        await this.github!.rest.repos.createRelease({
            owner: sharedInformation.owner,
            repo: sharedInformation.repo,
            tag_name: tagName,
            make_latest: "true",
            body: `Whats changed:\n${changelog}`
        })
    }
}