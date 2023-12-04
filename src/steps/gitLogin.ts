import type { SharedInformation, Step } from '@types';
import { Git } from '@utils';

export default {
    name: "GIT_LOGIN",
    description: "Logs into GIT",
    run: async (sharedInformation: SharedInformation) => {
        const git = new Git(sharedInformation.githubUrl);

        git.login(
            process.env.CI_BOT_NAME,
            process.env.CI_BOT_EMAIL
        )
    }
} as Step;