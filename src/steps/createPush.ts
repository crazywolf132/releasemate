import type { SharedInformation, Step } from '@types';
import { logger, Git } from '@utils';

const log = logger('GIT_PUSH');

export default {
    name: 'GIT_PUSH',
    description: 'Pushes the changes to the remote repository',
    run: async (sharedInformation: SharedInformation) => {
        log(`Pushing changes to ${sharedInformation.githubUrl}`);
        if (sharedInformation.dryRun) {
            log(` -- DRY RUN: Would have pushed changes to ${sharedInformation.githubUrl}`)
            return true;
        }
        new Git(sharedInformation.monoRepoRoot).push();
        return true;
    }
} as Step