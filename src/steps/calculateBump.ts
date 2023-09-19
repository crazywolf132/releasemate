import type { Step } from '@types';
import { logger, calculateNewVersion } from '@utils';

const log = logger('CALCULATE_BUMP');

export default {
    name: "CALCULATE_BUMP",
    description: "Performs the bump analysis for each package",
    run: async (sharedInformation) => {

        // We will now loop through the packages, and we will calculate the new version for each package.
        for (const [packageName, pkg] of Object.entries(sharedInformation.packages)) {
            // We are first going to see if there was any commits done on this package.
            if (pkg.commits.length === 0) {
                // We will now set the new version to the current version.
                log(`Skipping ${packageName} as there was no commits done on it.`)
                continue;
            }

            // We will now calculate the new version for this package.
            calculateNewVersion(pkg, pkg.bumpType, sharedInformation.versionFormat);
        }

        return true

    }
} as Step;