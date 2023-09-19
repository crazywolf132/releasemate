import type { Step } from '@types';
import { logger } from '@utils'
import { execSync } from 'child_process';

const log = logger('PUBLISH_PACKAGE');

export default {
    name: "PUBLISH_PACKAGE",
    description: "Publishes the package to the registry",
    run: async (sharedInformation) => {

        const rules = sharedInformation.releaseConfig.rules;

        for (const [pkgName, pkg] of Object.entries(sharedInformation.packages)) {

            // We are going to check to see if there are any `noRelease` packages for `npm`
            // under the `*` property or the release config we are running.
            if (rules["*"]?.npm?.noRelease?.includes(pkgName) || rules[sharedInformation.releaseType]?.npm?.noRelease?.includes(pkgName)) {
                log(`Asked to skip ${pkgName} by the config`);
                continue;
            }

            if (pkg.private) {
                log(`Skipping ${pkgName} as it is private.`)
                continue;
            }

            log(`Publishing ${pkgName}@${pkg.newVersion}`)
            if (!sharedInformation.dryRun) {
                // Checking to see if there is a logic function to run.
                if (!rules["*"]?.npm?.condition?.(pkg)) {
                    log(`Condition for release failed, check config for ${pkgName}`)
                    continue;
                }
                if (!rules[sharedInformation.releaseType]?.npm?.condition?.(pkg)) {
                    log(`Condition for release failed, check config for ${pkgName}`);
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