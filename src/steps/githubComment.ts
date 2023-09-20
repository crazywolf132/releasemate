import type { SharedInformation, Step } from '@types';
import { GithubAPI, logger } from '@utils';

const log = logger('GITHUB_COMMENT');

export default {
    name: 'GITHUB_COMMENT',
    description: 'Creates a comment on the pull request with the new version',
    run: async (sharedInformation: SharedInformation) => {

        if (sharedInformation.dryRun) {
            log(`Skipping PR comments, this a dry run`);
        }

        const isMasterBranch: boolean = String(process.env.BRANCH_NAME).toLowerCase() === sharedInformation.releaseConfig.baseBranchName ?? "main";
        const cleanedPrNumber: number | null = isMasterBranch ? null : +String(process.env.BRANCH_NAME).replace('PR-', '');
        if (!isMasterBranch) {
            log(`Not master branch, only doing PR version comment`);
            await GithubAPI.instance.deletePreviousCIComments(cleanedPrNumber!, sharedInformation);
            log(`Deleted previous comments on ${sharedInformation.owner}/${sharedInformation.repo}#${cleanedPrNumber!}`)

            // Creating the comment.
            const comment = sharedInformation.releaseConfig.githubComments.pullRequest;
            if (typeof comment === 'string') {
                await GithubAPI.instance.createComment(comment, cleanedPrNumber!, sharedInformation);
            } else {
                await GithubAPI.instance.createComment(comment(Object.values(sharedInformation.packages)), cleanedPrNumber!, sharedInformation);
            }
            log(`Created comment on ${sharedInformation.owner}/${sharedInformation.repo}#${cleanedPrNumber!}`);
            return
        }
    }
}