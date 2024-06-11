import type { Step } from '@types';
import { Git, absolutePath, ep } from '@utils';
import log from 'volog';

export default {
    name: "READ_COMMITS",
    description: "Reads the commits from the git log",
    run: async (sharedInformation) => {

        log.settings.scope = 'READ_COMMITS'

        const git = new Git(ep(sharedInformation.monoRepoRoot));

        // We will get all the commits and group them by package.
        log.info('Reading the commits from the git log');

        let commits: any;
        if (sharedInformation.releaseConfig.useTags) {
            commits = git.getCommitsByPathsSinceLastTag(
                Object.values(sharedInformation.packages).map(pkg => absolutePath(pkg.path.split("/").slice(0, -1).join("/")))
            );
        } else {
            commits = git.getCommitsSinceLastReleaseCommit(
                Object.values(sharedInformation.packages).map(pkg => absolutePath(pkg.path.split("/").slice(0, -1).join("/")))
            )
        }

        // We are going to to update each of the packages with the commits that have been made to them.
        Object.values(sharedInformation.packages).forEach(pkg => {
            const absPath = absolutePath(pkg.path.split("/").slice(0, -1).join("/"))
            pkg.commits = commits[absPath] ?? [];
        })

        return true
    }
} as Step