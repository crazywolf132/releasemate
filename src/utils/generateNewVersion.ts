/**
 * This is used to actually change the version.
 */

import type { BumpType } from "@types";
import SemVer from "semver";

export const generateNewVersion = (version: string, bumpType: BumpType, versionFormat: string) => {
    let updated = SemVer.inc(version, bumpType as any) as string;
    let { major, minor, patch } = SemVer.parse(updated) as SemVer.SemVer;

    // We are now going to combine the version parts with the env... to allow for more control.
    const localEnv = { ...process.env, major, minor, patch };
    // We are now going to loop through all the keys in the local env, and we are going to replace them in the version.
    updated = versionFormat;
    for (const [key, value] of Object.entries(localEnv)) {
        updated = updated.replace(`{${key}}`, String(value));
    }

    return updated;
}