/**
 * Used to calculate a new version for a package.
 * This uses semantic versioning under the hood.
 */

import type { Package, BumpType } from "@types";
import SemVer from "semver";
import { generateNewVersion } from "./generateNewVersion";

export const calculateNewVersion = (pkg: Package, releaseType: string, versionFormat: string) => {

    // First we will workout what kind of bump we are going to do.
    let bump: BumpType = 'patch';

    // We will loop through the commits, and search to see if there
    // is a `feat` or a `fix` commit. If there is, we will bump the
    // version to the next minor or major version.

    for (const commit of pkg.commits) {
        const [typeAndScope] = commit.split(": ");
        const [type, scope] = typeAndScope.split("(");

        // There is the possibility that there will be a scope, or there will not be.
        // So we need to check for that.

        if (type.endsWith("!") || String(scope).endsWith(")!")) {
            bump = "major"
            continue;
        }

        // We wont bother with the next part if it is already a major bump.
        if (bump === "major") continue;

        switch (true) {
            case type.toLowerCase().startsWith("fix"):
            case type.toLowerCase().startsWith("feat"):
                bump = "minor";
                break;
        }
    }

    pkg.bumpType = bump;
}