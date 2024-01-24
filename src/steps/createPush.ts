import type { SharedInformation, Step } from '@types';
import { Git } from '@utils';
import log from 'volog';

export default {
    name: 'GIT_PUSH',
    description: 'Pushes the changes to the remote repository',
    run: async (sharedInformation: SharedInformation) => {

        log.settings.scope = 'GIT_PUSH'

        log.info(`Pushing changes`, 'githubUrl', sharedInformation.githubUrl);
        if (sharedInformation.dryRun) {
            log.debug(` -- DRY RUN: Would have pushed changes`, `githubUrl`, sharedInformation.githubUrl)
            return true;
        }
        new Git(sharedInformation.monoRepoRoot).push();
        return true;
    }
} as Step