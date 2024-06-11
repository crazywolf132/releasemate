import type { SharedInformation, Step } from '@types';
import { Git } from '@utils';
import log from 'volog';

export default {
    name: 'CREATE_TAG',
    description: 'Creates a tag with the new version',
    run: async (sharedInformation: SharedInformation) => {

        log.settings.scope = 'CREATE_TAG'

        if (!sharedInformation.releaseConfig.useTags) {
            log.warn(`Skipping tag creation`, 'reason', 'useTags is set to "false"')
            return true;
        }

        for (const pkg of Object.values(sharedInformation.packages)) {
            log.info(`Creating tag`, 'packageName', pkg.name);
            const git = new Git(sharedInformation.githubUrl);

            // Create tag
            if (sharedInformation.dryRun) {
                log.debug(` -- DRY RUN: Would have created tag`, 'packageName', pkg.name)
                continue;
            }
            git.createTag(`${pkg.name}-${pkg.newVersion}`, `release(${pkg.name}): ${pkg.newVersion}`);
            log.info(`Created tag`, 'packageName', pkg.name, 'tag', `${pkg.name}-${pkg.newVersion}`);
        }

        return true;
    }
} as Step