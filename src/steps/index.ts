import findConfig from "./findConfig";
import findPackages from "./findPackages";
import calculateBump from "./calculateBump";
import readCommits from "./readCommits";
import deepLinkPackages from "./deepLinkPackages";
import performBump from "./performBump";
import publishPackage from "./publishPackage";
import createChangelog from "./createChangelog";
import createCommit from "./createCommit";
import createTag from "./createTag";
import createGithubRelease from "./createGithubRelease";
import githubComment from "./githubComment";
import createPush from "./createPush";
import performVersionRules from "./performVersionRules";

export default [
    findConfig, // Finds the release config
    findPackages, // Finds the packages to release
    deepLinkPackages, // Gets the dependency tree for the packages
    readCommits, // Gets all the commits for each package
    calculateBump, // Calculates what type of release to do 
    performBump, // Performs the bump on the package.json
    performVersionRules, // Performs all version specific rules
    createChangelog, // Creates a changelog for each package
    publishPackage, // Publishes the package to npm
    createCommit, // Creates the commits for each package
    createTag, // Creates a release tag for each package
    createPush, // Creates a push for each package
    createGithubRelease, // Creates a github release for each package
    githubComment // Comments on all prs that have been released
]