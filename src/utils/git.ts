import { execSync } from "node:child_process";

export class Git {
    private readonly repoPath: string;

    constructor(repoPath: string) {
        this.repoPath = repoPath;
    }

    // Login to git repo
    login(username: string, email: string): void {
        // Setting username and email as global config
        this.runGitCommand(`config --global user.name "${username}"`);
        this.runGitCommand(`config --global user.email "${email}"`);
        // this.runGitCommand(`config --global user.password "${password}"`);
    }

    // Create a new git tag
    createTag(tagName: string, message: string): void {
        this.runGitCommand(`tag -a ${tagName} -m "${message}"`);
    }

    // Commit changes with a message
    commit(message: string): void {
        this.runGitCommand(`commit -m "${message}"`);
    }

    // Push changes to remote
    push(remote: string = "origin", branch: string = "main"): void {
        this.runGitCommand(`push ${remote} ${branch}`);
    }

    // Get commits since last tag
    getCommitsSinceLastTag(): string[] {
        return this.runGitCommand(`log $(git describe --tags --abbrev=0)..HEAD --oneline`).split("\n").filter(Boolean);
    }

    // Get commits since last tag, grouped by paths
    getCommitsByPathsSinceLastTag(paths: string[]): Record<string, string[]> {
        const groupedCommits: Record<string, string[]> = {};
        paths.forEach((path) => {
            const commits = this.runGitCommand(`log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%s" -- ${path}`);
            groupedCommits[path] = commits ? commits.split('\n').filter(Boolean) : [];
        });
        return groupedCommits;
    }

    // Get all commits for the path
    getAllCommitsForPath(path: string): string[] {
        return this.runGitCommand(`log --pretty=format:'%h %s' -- ${path}`).split("\n").filter(Boolean);
    }

    // Get all commits
    getAllCommits(): string[] {
        return this.runGitCommand(`log --oneline`).split("\n");
    }

    // Get list of tags
    getListOfTags(): string[] {
        const tags = this.runGitCommand('tag --list').split("\n");
        return tags.filter(Boolean)
    }

    // Get last release commit
    getLastReleaseCommit(): Record<string, string> {
        const commitMessage = this.runGitCommand(`log --grep="chore: release" --pretty=format:"%B" -n 1`).trim();
        const commitMap: Record<string, string> = {};
        const commitEntries = commitMessage.split("\n");
        commitEntries.forEach((entry) => {
            const [packageName, version] = entry.split(": v");
            commitMap[packageName.trim().replace(' -', '')] = version.trim();
        });
        return commitMap;
    }

    // Git add
    add(path: string = "."): void {
        this.runGitCommand(`add ${path}`);
    }

    private runGitCommand(command: string): string {
        try {
            return execSync(`git ${command}`, { encoding: 'utf8'}).trim();
        } catch (error: unknown) {
            throw new Error(`Git command failed: ${command}\n${(error as Error).message}`);
        }
    }
}