import type { Step } from '@types';
import { calculateNewVersion } from '@utils';
import log from 'volog';

export default {
    name: "CALCULATE_BUMP",
    description: "Performs the bump analysis for each package",
    run: async (sharedInformation) => {
        log.settings.scope = 'CALCULATE_BUMP';
        // We will now loop through the packages, and we will calculate the new version for each package.
        for (const [packageName, pkg] of Object.entries(sharedInformation.packages)) {
            // We are first going to see if there was any commits done on this package.
            if (pkg.commits.length === 0) {
                // We will now set the new version to the current version.
                log.warn(`Skipping as there are are no commits`, "packageName", packageName)
                continue;
            }

            // We will now calculate the new version for this package.
            calculateNewVersion(pkg, pkg.bumpType, sharedInformation.versionFormat);
            log.info(`Calculated new version`, "packageName", packageName, "newVersion", pkg.newVersion);
        }

        return true

    }
} as Step;