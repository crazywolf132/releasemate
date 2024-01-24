import type { Dict, Package as PackageType } from "@types";
import { ep } from '@utils';
import log from 'volog';

export class Package implements PackageType {
    public name: string;
    public path: string;
    public packageJson: any;
    public version: string;
    public newVersion: string;
    public private: boolean;

    public commits: string[] = [];
    public dependents: string[] = [];
    public bumpType: 'major' | 'minor' | 'patch' | 'none' = 'none';

    // This gets used by topological sort
    private allDependencies: string[] = [];

    private devDependencies: Dict<string> = {};
    private peerDependencies: Dict<string> = {};
    private dependencies: Dict<string> = {};

    constructor(pkgJsonPath: string, logger: typeof log) {

        this.path = pkgJsonPath.split('/').slice(0, -1).join('/');

        this.packageJson = require(ep(pkgJsonPath));
        this.version = this.packageJson.version;
        this.newVersion = this.packageJson.version;
        this.private = this.packageJson.private || false;

        this.name = this.packageJson.name;

        // We only use the logger once.
        logger.info(`Found package`, 'name', this.name, 'version', this.version);
        this.fetchDependencies();
    }

    public addDependency(dependency: string, version: string, type: 'devDependencies' | 'peerDependencies' | 'dependencies') {
        if (this[type][dependency]) {
            return;
        }

        this[type][dependency] = version;
    }

    public updateDependency(dependency: string, version: string) {
        if (this.dependencies[dependency]) {
            this.dependencies[dependency] = version;
        } else if (this.devDependencies[dependency]) {
            this.devDependencies[dependency] = version;
        } else if (this.peerDependencies[dependency]) {
            this.peerDependencies[dependency] = version;
        }
    }

    public removeDependency(dependency: string) {
        delete this.dependencies[dependency];
        delete this.devDependencies[dependency];
        delete this.peerDependencies[dependency];
    }

    private fetchDependencies() {
        this.devDependencies = this.packageJson.devDependencies ?? {}
        this.peerDependencies = this.packageJson.peerDependencies ?? {}
        this.dependencies = this.packageJson.dependencies ?? {}

        this.allDependencies = [
            ... new Set<string>([
                ...Object.keys(this.dependencies),
                ...Object.keys(this.peerDependencies),
                ...Object.keys(this.devDependencies)
            ])
        ]
    }

    get dependenciesList() {
        return this.allDependencies;
    }
}