import type { SharedInformation, Step } from '@types';
import { Git } from '@utils';
import log from 'volog';

export default {
    name: "GIT_LOGIN",
    description: "Logs into GIT",
    run: async (sharedInformation: SharedInformation): Promise<boolean> => {

        log.settings.scope = 'GIT_LOGIN'

        const git = new Git(sharedInformation.githubUrl);

        if (['CI_BOT_NAME', 'CI_BOT_EMAIL'].some((key) => !process.env[key])) {
            log.fatal(`Missing environment variables`, 'missingVariables', ['CI_BOT_NAME', 'CI_BOT_EMAIL'].join("\n"))
        }

        git.login(
            process.env.CI_BOT_NAME!,
            process.env.CI_BOT_EMAIL!
        )
        return true
    }
} as Step;