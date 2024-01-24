import type { SharedInformation, Step } from '@types';
import { GithubAPI } from '@utils';
import log from 'volog';

export default {
    name: 'CREATE_GITHUB_RELEASE',
    description: 'Creates a GitHub release with the new version',
    run: async (sharedInformation: SharedInformation) => {

        log.settings.scope = 'CREATE_GITHUB_RELEASE'

        const rules = sharedInformation.releaseConfig.rules;
        const globalRules = rules["*"] ?? {}
        const localRules = rules[sharedInformation.releaseType] ?? {}

        for (const pkg of Object.values(sharedInformation.packages)) {

            if (globalRules?.github?.noRelease?.includes(pkg.name) || localRules?.github?.noRelease?.includes(pkg.name)) {
                log.warn(`Skipping release`, 'packageName', pkg.name, 'reason', 'defined in config')
                continue;
            }

            if (typeof globalRules?.github?.condition === 'function' && !globalRules?.github?.condition?.(pkg)) {
                log.error(`Conditions not met for release`, 'packageName', pkg.name, 'reason', `custom conditions provided`, `location`, `global`)
                continue;
            }

            if (typeof localRules?.github?.condition === 'function' && !localRules?.github?.condition?.(pkg)) {
                log.error(`Conditions not met for release`, 'packageName', pkg.name, 'reason', `custom conditions provided`, `location`, `local`)
                continue;
            }

            if (pkg.version === pkg.newVersion) {
                log.warn(`Skipping release`, 'packageName', pkg.name, 'reason', `versions are the same`)
                continue;
            }

            // Create GitHub release
            log.info("Creating GitHub release", 'packageName', pkg.name)
            if (!sharedInformation.dryRun)
                GithubAPI.instance.createGithubRelease(pkg.name, `${pkg.name}-${pkg.newVersion}`, sharedInformation);
            else
                log.debug(` -- DRY RUN: Would have created a GitHub release`, 'packageName', pkg.name)
        }

        return true;
    }
} as Step