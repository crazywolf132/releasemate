import type { Step } from '@types';
import log from 'volog';

export default {
    name: "UPDATE_PACKAGES",
    description: "Updates the dependents of packages to their new version",
    run: async (sharedInformation) => {

        log.settings.scope = 'UPDATE_PACKAGES'

        for (const [pkgName, pkg] of Object.entries(sharedInformation.packages)) {
            // If there was no bump, we will not update the dependents.
            if (pkg.bumpType === 'none') {
                log.warn(`Skipping dependents, as there was no version change`, `packageName`, pkg.name)
                continue;
            }
            for (const dependency of pkg.dependents) {
                sharedInformation.packages[dependency].updateDependency(pkgName, pkg.newVersion);
                log.info(`Updated dependency`, `packageName`, dependency, `dependency`, `${pkgName}@${pkg.newVersion}`)
            }
        }

        return true
    }
} as Step;