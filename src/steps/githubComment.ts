import type { SharedInformation } from '@types';
import { GithubAPI } from '@utils';
import log from 'volog';

export default {
    name: 'GITHUB_COMMENT',
    description: 'Creates a comment on the pull request with the new version',
    run: async (sharedInformation: SharedInformation) => {

        log.settings.scope = 'GITHUB_COMMENT'

        if (sharedInformation.dryRun) {
            log.debug(`-- DRY RUN: Skipping PR comments`)
            return;
        }

        const isMasterBranch: boolean = String(process.env.BRANCH_NAME).toLowerCase() === sharedInformation.releaseConfig.baseBranchName ?? "main";
        const cleanedPrNumber: number | null = isMasterBranch ? null : +String(process.env.BRANCH_NAME).replace('PR-', '');
        if (!isMasterBranch) {
            log.info(`Not master branch, only doing PR version comment`);
            await GithubAPI.instance.deletePreviousCIComments(cleanedPrNumber!, sharedInformation);
            log.info(`Deleted previous comments`, 'prNumber', cleanedPrNumber!);

            // Creating the comment.
            const comment = sharedInformation.releaseConfig.githubComments.pullRequest;
            if (typeof comment === 'string') {
                await GithubAPI.instance.createComment(comment, cleanedPrNumber!, sharedInformation);
            } else {
                await GithubAPI.instance.createComment(comment(Object.values(sharedInformation.packages)), cleanedPrNumber!, sharedInformation);
            }
            log.info(`Created comment`, 'prNumber', cleanedPrNumber!);
            return
        }
    }
}