import type { Step } from '@types';
import { ep, makeChangelog, writeFile } from '@utils';
import log from 'volog';

export default {
    name: "CHANGELOG",
    description: "Creates a changelog for each package",
    run: async (sharedInformation) => {
        log.settings.scope = 'CHANGELOG';

        for (const pkg of Object.values(sharedInformation.packages)) {
            if (pkg.bumpType === 'none') {
                log.warn(`Skipping changelog, there was no version change`, `packageName`, pkg.name)
                continue;
            }

            // We are going to create a changelog for this package.
            // We are going to do this by getting all the commits that have been made since the last version.
            log.info(`Creating changelog`, 'packageName', pkg.name);
            const changelog = makeChangelog(sharedInformation, pkg);
            writeFile(ep(pkg.path, 'CHANGELOG.md'), changelog);
        }
        return true;
    }
} as Step