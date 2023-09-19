import type { Step } from '@types';
import { logger, generateNewVersion } from '@utils';

const log = logger('PERFORM_BUMP');

export default {
    name: "PERFORM_BUMP",
    description: "Performs the version bump based on other packages",
    run: async (sharedInformation) => {

        // We will now loop through the packages, and we will calculate the new version for each package.
        for (const [packageName, pkg] of Object.entries(sharedInformation.packages)) {
            // We are first going to see if there was any commits done on this package.
            if (pkg.commits.length === 0) {
                // We will now set the new version to the current version.
                log(`Skipping ${packageName} as there was no commits done on it.`)
                continue;
            }

            // We will now update the `newVersion` based on the bump type
            pkg.newVersion = generateNewVersion(pkg.version, pkg.bumpType, sharedInformation.versionFormat) as string;
            log(`Updated ${packageName} to ${pkg.newVersion}`)
        }

        return true
    }
} as Step;