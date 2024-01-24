import type { SharedInformation, Step } from '@types';
import { Git } from '@utils';
import log from 'volog';

export default {
    name: 'CREATE_COMMIT',
    description: 'Creates a commit with the new version',
    run: async (sharedInformation: SharedInformation) => {

        log.settings.scope = 'CREATE_COMMIT'

        for (const pkg of Object.values(sharedInformation.packages)) {
            log.info(`Creating commit`, 'packageName', pkg.name)
            const git = new Git(pkg.path);


            if (!sharedInformation.dryRun) {
                // Add files to git
                git.add(pkg.path);

                // Create commit message
                git.commit(`release(${pkg.name}): ${pkg.newVersion}`);
            } else {
                log.debug(` -- DRY RUN: Would have added files to git`, 'packageName', pkg.name)
            }

        }

        return true;
    }
} as Step