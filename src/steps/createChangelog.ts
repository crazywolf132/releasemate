import type { Step } from '@types';
import { ep, logger, makeChangelog, writeFile } from '@utils';

const log = logger('CHANGELOG');

export default {
    name: "CHANGELOG",
    description: "Creates a changelog for each package",
    run: async (sharedInformation) => {

        for (const pkg of Object.values(sharedInformation.packages)) {
            if (pkg.bumpType === 'none') {
                log(`Skipping changelog, as there was no version change for ${pkg.name}`)
                continue;
            }

            // We are going to create a changelog for this package.
            // We are going to do this by getting all the commits that have been made since the last version.
            log(`Creating changelog file for ${pkg.name}`)
            const changelog = makeChangelog(sharedInformation, pkg);
            writeFile(ep(pkg.path, 'CHANGELOG.md'), changelog);

        }
        return true;
    }
} as Step