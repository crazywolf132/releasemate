import type { SharedInformation, Step } from '@types';
import { logger } from '@utils';

const log = logger('GITHUB_COMMENT');

export default {
    name: 'GITHUB_COMMENT',
    description: 'Creates a comment on the pull request with the new version',
    run: async (sharedInformation: SharedInformation) => {
        return true;
    }
}