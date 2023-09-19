#! /usr/bin/env node

import { Command as Commander } from 'commander';

import { name, description, version } from '../package.json'
import { readConfig, GithubAPI } from '@utils';
import { ReleaseMate } from './core/releaseSystem';

(async () => {

    const program = new Commander();

    program.name(name)
        .description(description)
        .version(version)

    // We are going to get the versionFormats from the config... these will dictate the
    // different release types.

    const config = readConfig();

    // Starting the github auth back here... so then we are sure it will start in time.
    await GithubAPI.instance.init();

    for (const [name, format] of Object.entries(config.versionFormats)) {
        program.command(name)
            .description(`This will perform a "${name}" release`)
            .option('-d, --dry', 'This will run the command in dry run mode', false)
            .action((args) => {
                console.log(format)

                ReleaseMate.instance.mode(name, String(format), (args as any)?.dry);
                ReleaseMate.instance.run();
            })
    }

    program.parse();
})();