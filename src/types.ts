export type Version = {
    major: number;
    minor: number;
    patch: number;
}

export type IncrementalVersion = Version & {
    incremental: number;
}

export type BumpType = "major" | "minor" | "patch" | "none";

export type Dict<T> = {
    [key: string]: T;
}

/*---------------------------------*/
/*      Release System Types       */
/*---------------------------------*/

export interface Package {
    /** Name of the package */
    name: string;
    /** Version of the package */
    version: string;
    /** New version of the package */
    newVersion: string;
    /** Path to the package */
    path: string;
    /** If the package is private */
    private: boolean;
    /** Getter function for getting the list of dependencies */
    dependenciesList: string[];
    /** Commits found for the package */
    commits: string[];
    /** List of packages that depend on it */
    dependents: string[];
    /** Type of bump that was performed */
    bumpType: BumpType;

    /** Updates dependency to specified version */
    updateDependency: (dependency: string, version: string) => void;
}

type globalRules = {
    npm: {
        noRelease: string[];
        condition: (pkg: Package) => boolean;
    }
    github: {
        noRelease: string[];
        condition: (pkg: Package) => boolean;
    };
    versionRules: {
        [key: string]: {
            copyFrom: string;
            logic: (pkg: Package) => string;
        };
    };
};

export type Config = {
    /** Org name */
    owner: string;
    /** Repo name */
    repo: string;
    /** Github URL to use */
    github: string;

    /** Github bot username */
    ciBotName: string;

    /** Name of the base git branch */
    baseBranchName: string;

    /** Workspace packages to ignore */
    ignore?: string[];

    /** Use tags to determine the version */
    useTags?: boolean;

    /** System rules */
    rules: {
        "*": globalRules;

        [key: string]: {
            storage: string;
            resetOnRelease: boolean;
        } & globalRules | globalRules;
    };

    versionFormats: {
        [key: string]: string;
    }

    githubComments: {
        [key: string]: ((pkgs: Package[]) => string) | string;
    }
}

export interface SharedInformation {
    /** If we are working in a monorepo */
    isMonoRepo: boolean;
    /** If we are working in a monorepo, what is the root of the monorepo */
    monoRepoRoot: string;
    /** If we are working in a monorepo, the packages locations */
    monoRepoPackages: string[];

    /** Release Config */
    releaseConfig: Config;

    /** Packages */
    packages: Dict<Package>;

    releaseType: string;
    versionFormat: string;
    dryRun: boolean;

    /** Github url to use */
    githubUrl: string;
    /** Github org */
    owner: string;
    /** Github repo */
    repo: string;
}

/*---------------------------------*/
/*           Step Types            */
/*---------------------------------*/

export type Step = {
    /** Name of the step */
    name: string;
    /** What the step does */
    description: string;
    /** Actual function of the step */
    run: (info: SharedInformation) => Promise<boolean>;
}