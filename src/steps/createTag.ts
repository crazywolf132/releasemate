import type { SharedInformation, Step } from '@types';
import { Git, logger } from '@utils';

const log = logger('CREATE_TAG');

export default {
    name: 'CREATE_TAG',
    description: 'Creates a tag with the new version',
    run: async (sharedInformation: SharedInformation) => {

        for (const pkg of Object.values(sharedInformation.packages)) {
            log(`Creating tag for ${pkg.name}`);
            const git = new Git(sharedInformation.githubUrl);

            // Create tag
            if (sharedInformation.dryRun) {
                log(`Skipping tag creation, this is a dry run`);
                continue;
            }
            git.createTag(`${pkg.name}-${pkg.newVersion}`, `release(${pkg.name}): ${pkg.newVersion}`);
        }

        return true;
    }
} as Step