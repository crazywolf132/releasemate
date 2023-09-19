import type { SharedInformation, Step } from '@types';
import { Git, logger } from '@utils';

const log = logger('CREATE_COMMIT');

export default {
    name: 'CREATE_COMMIT',
    description: 'Creates a commit with the new version',
    run: async (sharedInformation: SharedInformation) => {

        for (const pkg of Object.values(sharedInformation.packages)) {
            log(`Creating commit for ${pkg.name}`);
            const git = new Git(pkg.path);


            if (!sharedInformation.dryRun) {
                // Add files to git
                git.add(pkg.path);

                // Create commit message
                git.commit(`release(${pkg.name}): ${pkg.newVersion}`);
            } else {
                log(` -- DRY RUN: Would have created a commit for ${pkg.name}`)
            }

        }

        return true;
    }
} as Step