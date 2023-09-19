module.exports = {
    owner: "NAB-X",
    repo: "x-bundle-native",
    github: "https://github.com/",

    rules: {

        "*": {
            npm: {
                noRelease: ["ExampleBook"]
            },
            github: {
                noRelease: ["ExampleBook"]
            },
            versionRules: {
                "ExampleBook": {
                    copyFrom: "nui-components"
                }
            }
        },

        nightly: {
            storage: "package.json",
            resetOnRelease: true,
        },
    },

    versionFormats: {
        "nightly": "{major}.{minor}.{patch}-nightly.{incremental}",
        "prod": "{major}.{minor}.{patch}",
        "pr": "{major}.{minor}.{patch}-pr.{pr}",
    }
}