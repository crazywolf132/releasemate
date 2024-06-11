import type { Step } from "@types";
import { ep } from "@utils";
import { existsSync, readFileSync } from "fs-extra";
import yaml from 'js-yaml';
import log from 'volog';
import { readConfig } from "../utils/readConfig";

export default {
    name: 'FIND_CONFIG',
    description: "Finds the config file for the release system",
    run: async (sharedInformation) => {

        log.settings.scope = 'FIND_CONFIG'

        log.info('Finding the config file for the release system');
        // We are going to check to see if we are running in the root of a mono repo.
        // We will check to see if there is a package.json above us. If there is, we will check to see if it has a workspaces property.
        // If it does, we will set the monoRepoRoot to the current directory, and the monoRepoPackages to the workspaces property.
        // If it doesn't, we will set the monoRepoRoot to the current directory, and the monoRepoPackages to an empty array (unless it has a workspaces property, then we will set it to that).
        const config = readConfig();
        sharedInformation.releaseConfig = config;
        sharedInformation.githubUrl = `${config.github}/${config.owner}/${config.repo}`.replace(/\/\//g, '/');

        if (existsSync(ep('..', 'package.json'))) {
            // There is a package.json above us.
            const packageJson = require(ep('..', 'package.json'));

            // They have workspaces enabled... so it is a mono repo.
            if (packageJson.workspaces) {
                sharedInformation.isMonoRepo = true;
                sharedInformation.monoRepoRoot = ep('..');
                sharedInformation.monoRepoPackages = packageJson.workspaces;
            } else {
                sharedInformation.isMonoRepo = true;
                sharedInformation.monoRepoRoot = ep('..');
                sharedInformation.monoRepoPackages = [];
            }
            log.info("Found mono repo", "monoRepoRoot", sharedInformation.monoRepoRoot, "monoRepoPackages", sharedInformation.monoRepoPackages)
        } else {
            // There is no package.json above us.
            sharedInformation.isMonoRepo = false;
            sharedInformation.monoRepoRoot = ep();
            // We will check to see if this folder has a package.json, and if it does ... we will check to 
            // see if there is a workspaces property. If there is, we will set the monoRepoPackages to that.

            if (existsSync(ep('package.json'))) {
                const packageJson = require(ep('package.json'));

                if (packageJson.workspaces) {
                    sharedInformation.isMonoRepo = true;
                    sharedInformation.monoRepoPackages = packageJson.workspaces;
                } else {
                    sharedInformation.monoRepoPackages = [];
                }

                // One last check is to see if there is a `pnpm-workspace.yaml` file.
                if (existsSync(ep('pnpm-workspace.yaml'))) {
                    sharedInformation.isMonoRepo = true;
                    const workspaces = yaml.load(readFileSync(ep('pnpm-workspace.yaml'), 'utf-8')) as any;
                    sharedInformation.monoRepoPackages = workspaces.packages ?? [];
                }
            } else {
                // We need to throw an error... We cannot find where the package.json is
                log.error(`Cannot find package.json`, 'path', ep('package.json'));
                return false
            }
        }

        if (sharedInformation.isMonoRepo) {
            if (sharedInformation.releaseConfig.ignore) {
                log.warn(`Ignoring packages`, 'reason', 'ignore property in config')
                sharedInformation.monoRepoPackages = sharedInformation.monoRepoPackages.filter(pkg => !sharedInformation.releaseConfig.ignore!.includes(pkg));
            }
        }

        return true;
    }
} as Step