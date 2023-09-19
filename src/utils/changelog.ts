/**
 * Used to make a changelog from a set of commit messages.
 */

import { Package, SharedInformation } from "@types"
import { Git } from "./git";
import { ep } from "./easyPath";
import { absolutePath } from "./absolutePath";
import { execSync } from "child_process";

const emojis: Record<string, string> = {
    feat: '🚀',
    fix: '🔧',
    docs: '📚',
    style: '🎨',
    refactor: '🛠️',
    perf: '🏎️',
    test: '🧪',
    chore: '🧹',
    ci: '🤖',
    breaking: '⚠️',
    release: '📦',
};

type Commit = {
    hash: string;
    message: string;
    scope?: string;
    isBreaking: boolean;
};

export const makeChangelog = (sharedInformation: SharedInformation, pkg: Package): string => {
    // const logOutput = execSync(`git --git-dir=${directory}/.git log --pretty=format:'%H %s'`).toString();
    // const commitLines = logOutput.split('\n');
    const commitLines = new Git(sharedInformation.monoRepoRoot).getAllCommitsForPath(pkg.path);
    const commits: Commit[] = commitLines.map((line) => {
        const [hash, ...messageArr] = line.split(' ');
        const message = messageArr.join(' ');
        const isBreaking = message.includes('!');
        let [type, rest] = message.split(':');
        const scopeMatch = type.match(/(.*)\((.*)\)/);
        let scope: string | undefined;

        if (scopeMatch) {
            type = scopeMatch[1];
            scope = scopeMatch[2];
        }

        return { hash, message: rest.trim(), scope, isBreaking };
    });

    let changelog = '# Changelog\n';
    let releaseGroup: Commit[] = [];
    let contributors: Set<string> = new Set();
    let hasBreakingChanges = false;
    let releasedPackages: Set<string> = new Set();

    for (const commit of commits) {
        const type = commit.isBreaking ? 'breaking' : commit.message.split(' ')[0];
        if (type === 'chore(release)' || type === 'release') {
            if (releaseGroup.length > 0) {
                const releaseTitle = hasBreakingChanges ? '(Breaking Changes)' : '';
                changelog += formatReleaseGroup(releaseGroup, contributors, releaseTitle, releasedPackages, sharedInformation);
            }
            const releaseEmoji = type === 'release' ? emojis.release : '';
            changelog += `## ${releaseEmoji} ${commit.message} ${hasBreakingChanges ? '(Breaking Changes)' : ''}\n`;
            releaseGroup = [];
            contributors = new Set();
            releasedPackages = new Set();
            hasBreakingChanges = false;
        } else {
            const author = execSync(`git --git-dir=${sharedInformation.monoRepoRoot}/.git show -s --format='%ae' ${commit.hash}`).toString().trim();
            contributors.add(author);
            releaseGroup.push(commit);
            if (commit.isBreaking) {
                hasBreakingChanges = true;
            }
            if (commit.scope) {
                releasedPackages.add(commit.scope);
            }
        }
    }

    if (releaseGroup.length > 0) {
        const releaseTitle = hasBreakingChanges ? '(Breaking Changes)' : '';
        changelog += formatReleaseGroup(releaseGroup, contributors, releaseTitle, releasedPackages, sharedInformation);
    }

    return changelog;
}

function formatReleaseGroup(releaseGroup: Commit[], contributors: Set<string>, releaseTitle: string, releasedPackages: Set<string>, sharedInformation: SharedInformation): string {
    let releaseNotes = '';
    const groupByType: Record<string, string[]> = {};

    for (const commit of releaseGroup) {
        const type = commit.isBreaking ? 'breaking' : commit.message.split(' ')[0];
        const isPR = /#\d+/.test(commit.message);
        const commitLink = `${sharedInformation.githubUrl}/commit/${commit.hash}`;
        const formattedMessage = isPR
            ? `- ${commit.message.split(' ')[3]} [#${commit.message.match(/#(\d+)/)?.[1]}](${commitLink})`
            : `- ${commit.message} -- [view](${commitLink})`;

        if (!groupByType[type]) {
            groupByType[type] = [];
        }
        groupByType[type].push(formattedMessage);
    }

    for (const [type, messages] of Object.entries(groupByType)) {
        releaseNotes += `### ${emojis[type] || '📝'} ${type}\n`;
        for (const message of messages) {
            releaseNotes += `${message}\n`;
        }
    }

    releaseNotes += '\n### 👥 Contributors\n';
    for (const contributor of contributors) {
        const cleanContributor = contributor.split('@')[0];
        const contributorLink = `${sharedInformation.githubUrl}/${cleanContributor}`
        const commitsLink = `${sharedInformation.githubUrl}/commits?author=${cleanContributor}`;
        releaseNotes += `- [${cleanContributor}](${contributorLink}) -- [view commits](${commitsLink})\n`;
    }

    if (releasedPackages.size > 0) {
        releaseNotes += '\n### 📦 Released Packages\n```\n';
        for (const pkg of releasedPackages) {
            releaseNotes += `- ${pkg}\n`;
        }
        releaseNotes += '```\n';
    }

    return releaseNotes + '\n';
}