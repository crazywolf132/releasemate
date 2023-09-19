import type { SharedInformation, Step } from '@types';
import { GithubAPI, logger } from '@utils';

const log = logger('CREATE_GITHUB_RELEASE');

export default {
    name: 'CREATE_GITHUB_RELEASE',
    description: 'Creates a GitHub release with the new version',
    run: async (sharedInformation: SharedInformation) => {

        const rules = sharedInformation.releaseConfig.rules;
        const globalRules = rules["*"] ?? {}
        const localRules = rules[sharedInformation.releaseType] ?? {}

        for (const pkg of Object.values(sharedInformation.packages)) {

            if (globalRules?.github?.noRelease?.includes(pkg.name) || localRules?.github?.noRelease?.includes(pkg.name)) {
                log(`Skipping a release for ${pkg.name}, as the config said to`)
                continue;
            }

            if (!globalRules?.github?.condition?.(pkg)) {
                log(`Conditions failed for releasing ${pkg.name}, please see config`)
                continue;
            }

            if (!localRules?.github?.condition?.(pkg)) {
                log(`Conditions failed for releasing ${pkg.name}, please see config`);
                continue;
            }

            if (pkg.version === pkg.newVersion) {
                log(`Skipping a release for ${pkg.name}, as the versions are the same`)
                continue;
            }

            // Create GitHub release
            log(`Creating GitHub release for ${pkg.name}`);
            if (!sharedInformation.dryRun)
                GithubAPI.instance.createGithubRelease(pkg.name, `${pkg.name}-${pkg.newVersion}`, sharedInformation);
            else
                log(` -- DRY RUN: Would have created a GitHub release for ${pkg.name}`)
        }

        return true;
    }
} as Step