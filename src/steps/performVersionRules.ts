import type { SharedInformation, Step } from '@types'
import { logger } from '@utils'

const log = logger("VERSION_RULES");

export default {
    name: "VERSION_RULES",
    description: 'Performs version rules on the packages',
    run: async (sharedInformation: SharedInformation) => {
        log(`Looking for package version rules`);
        const rules = sharedInformation.releaseConfig.rules;
        const global = rules["*"] ?? {};
        const local = rules[sharedInformation.releaseType] ?? {};

        for (const pkg of Object.values(sharedInformation.packages)) {
            if ("versionRules" in global || "versionRules" in local) {
                log(`Found rules for ${pkg.name}`);
            } else {
                continue;
            }

            const packageRules = global.versionRules[pkg.name] ?? local.versionRules[pkg.name];
            if (packageRules.copyFrom) {
                log(`${pkg.name} has a copy version rule. Copying from ${packageRules.copyFrom}`);
                const theirPackage = sharedInformation.packages[packageRules.copyFrom];
                // Copying their version to replace ours
                pkg.newVersion = theirPackage.newVersion;
                log(`${pkg.name}'s new version is ${theirPackage.newVersion}`);
            } else if (packageRules.logic != null) {
                log(`${pkg.name} logic has been provided to calculate new version.`);
                const newVersion = packageRules?.logic?.(pkg);
                log(`${pkg.name}'s new version is ${newVersion}`);
                pkg.newVersion = newVersion;
            }
        }

        return true
    }
} as Step;