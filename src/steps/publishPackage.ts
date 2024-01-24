import type { Step } from '@types';
import { execSync } from 'child_process';
import log from 'volog';

export default {
    name: "PUBLISH_PACKAGE",
    description: "Publishes the package to the registry",
    run: async (sharedInformation) => {

        log.settings.scope = 'PUBLISH_PACKAGE'

        const rules = sharedInformation.releaseConfig.rules;

        for (const [pkgName, pkg] of Object.entries(sharedInformation.packages)) {

            // We are going to check to see if there are any `noRelease` packages for `npm`
            // under the `*` property or the release config we are running.
            if (rules["*"]?.npm?.noRelease?.includes(pkgName) || rules[sharedInformation.releaseType]?.npm?.noRelease?.includes(pkgName)) {
                log.warn(`Skipping publish`, 'packageName', pkgName, 'reason', 'defined in config')
                continue;
            }

            if (pkg.private) {
                log.info(`Skipping private package`, 'packageName', pkgName)
                continue;
            }

            log.info(`Publishing package`, 'packageName', pkgName, 'newVersion', pkg.newVersion)
            if (!sharedInformation.dryRun) {
                // Checking to see if there is a logic function to run.
                if (!rules["*"]?.npm?.condition?.(pkg)) {
                    log.error(`Conditions not met for release`, 'packageName', pkgName, 'reason', `custom conditions provided`)
                    continue;
                }
                if (!rules[sharedInformation.releaseType]?.npm?.condition?.(pkg)) {
                    log.error(`Conditions not met for release`, 'packageName', pkgName, 'reason', `custom conditions provided`)
                    continue;
                }
                execSync(`npm publish --access public`, {
                    cwd: pkg.path,
                })
            }
        }

        return true
    }
} as Step