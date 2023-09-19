import type { Step } from '@types';
import { logger } from '@utils';

const log = logger('UPDATE_PACKAGES');

export default {
    name: "UPDATE_PACKAGES",
    description: "Updates the dependents of packages to their new version",
    run: async (sharedInformation) => {

        for (const [pkgName, pkg] of Object.entries(sharedInformation.packages)) {
            // If there was no bump, we will not update the dependents.
            if (pkg.bumpType === 'none') {
                log(`Skipping dependents, as there was no version change for ${pkgName}`)
                continue;
            }
            for (const dependency of pkg.dependents) {
                sharedInformation.packages[dependency].updateDependency(pkgName, pkg.newVersion);
                log(`Updated ${dependency} to consume ${pkgName}@${pkg.newVersion}`)
            }
        }

        return true
    }
} as Step;