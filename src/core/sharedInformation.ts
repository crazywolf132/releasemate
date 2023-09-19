import type { Dict, Package, SharedInformation } from "@types";

export class SharedInformationImpl implements SharedInformation {
    public githubUrl: string = '';
    public owner: string = '';
    public repo: string = '';
    public releaseType: string = "";
    public versionFormat: string = "";
    public dryRun: boolean = true;
    public isMonoRepo: boolean = false;
    public monoRepoRoot: string = '';
    public monoRepoPackages: string[] = [];

    public releaseConfig: any = {};

    public packages: Dict<Package> = {};
}