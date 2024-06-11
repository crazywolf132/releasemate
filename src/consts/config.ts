/**
 * This is the default config for the release system
 */

import { Config } from "@types";

export const defaultConfig = {
    owner: "octocat",
    repo: "hello-world",
    github: "https://github.com",
    useTags: true
} satisfies Config