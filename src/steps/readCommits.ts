import type { Step } from '@types';
import { logger, ep, Git, absolutePath } from '@utils';

const log = logger('READ_COMMITS');

export default {
    name: "READ_COMMITS",
    description: "Reads the commits from the git log",
    run: async (sharedInformation) => {

        const git = new Git(ep(sharedInformation.monoRepoRoot));

        // We will get all the commits and group them by package.
        log('Reading the commits from the git log');

        // console.log(sharedInformation.packages)

        const commits = git.getCommitsByPathsSinceLastTag(
            Object.values(sharedInformation.packages).map(pkg => absolutePath(pkg.path.split("/").slice(0, -1).join("/")))
        );

        // We are going to to update each of the packages with the commits that have been made to them.
        Object.values(sharedInformation.packages).forEach(pkg => {
            const absPath = absolutePath(pkg.path.split("/").slice(0, -1).join("/"))
            pkg.commits = commits[absPath] ?? [];
        })

        return true
    }
} as Step