import calculateBump from "./calculateBump";
import createChangelog from "./createChangelog";
import createCommit from "./createCommit";
import createGithubRelease from "./createGithubRelease";
import createPush from "./createPush";
import createTag from "./createTag";
import deepLinkPackages from "./deepLinkPackages";
import findConfig from "./findConfig";
import findPackages from "./findPackages";
import gitLogin from './gitLogin';
import githubComment from "./githubComment";
import performBump from "./performBump";
import performVersionRules from "./performVersionRules";
import publishPackage from "./publishPackage";
import readCommits from "./readCommits";
import validateConfig from "./validateConfig";

export default [
    findConfig, // Finds the release config
    validateConfig, // Validates the config
    findPackages, // Finds the packages to release
    deepLinkPackages, // Gets the dependency tree for the packages
    gitLogin, // Logs into git
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