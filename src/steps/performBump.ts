import type { Step } from '@types';
import { generateNewVersion } from '@utils';
import log from 'volog';

export default {
    name: "PERFORM_BUMP",
    description: "Performs the version bump based on other packages",
    run: async (sharedInformation) => {

        log.settings.scope = 'PERFORM_BUMP';

        // We will now loop through the packages, and we will calculate the new version for each package.
        for (const [packageName, pkg] of Object.entries(sharedInformation.packages)) {
            // We are first going to see if there was any commits done on this package.
            if (pkg.commits.length === 0) {
                // We will now set the new version to the current version.
                log.warn(`Skipping as there are are no commits`, "packageName", packageName)
                continue;
            }

            // We will now update the `newVersion` based on the bump type
            pkg.newVersion = generateNewVersion(pkg.version, pkg.bumpType, sharedInformation.versionFormat) as string;
            log.info(`Updated new version`, "packageName", packageName, "newVersion", pkg.newVersion);
        }

        return true
    }
} as Step;