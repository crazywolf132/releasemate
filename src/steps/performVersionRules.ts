import type { SharedInformation, Step } from '@types';
import log from 'volog';

export default {
    name: "VERSION_RULES",
    description: 'Performs version rules on the packages',
    run: async (sharedInformation: SharedInformation) => {

        log.settings.scope = 'VERSION_RULES'

        log.info(`Looking for package version rules`);
        const rules = sharedInformation.releaseConfig.rules ?? {};
        const global = rules["*"] ?? {};
        const local = rules[sharedInformation.releaseType] ?? {};

        for (const pkg of Object.values(sharedInformation.packages)) {
            if (("versionRules" in global && pkg.name in global.versionRules) || ("versionRules" in local && pkg.name in local.versionRules)) {
                log.info(`Found rules for package`, `packageName`, pkg.name);
            } else {
                continue;
            }

            const packageRules = global.versionRules[pkg.name] ?? local.versionRules[pkg.name] ?? {};
            if (packageRules.copyFrom) {
                log.info(`Copy version rule found`, `packageName`, pkg.name, `copyFrom`, packageRules.copyFrom)
                const theirPackage = sharedInformation.packages[packageRules.copyFrom];
                // Copying their version to replace ours
                pkg.newVersion = theirPackage.newVersion;
                log.info(`Copied version`, `packageName`, pkg.name, `newVersion`, pkg.newVersion);
            } else if (packageRules.logic != null) {
                log.info(`Logic version rule found`, `packageName`, pkg.name)
                const newVersion = packageRules?.logic?.(pkg);
                log.info(`Calculated new version`, `packageName`, pkg.name, `newVersion`, newVersion);
                pkg.newVersion = newVersion;
            }
        }

        return true
    }
} as Step;