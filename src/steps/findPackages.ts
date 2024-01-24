import { Package } from '@core';
import type { Step } from '@types';
import { ep } from '@utils';
import glob from 'globby';
import log from 'volog';

export default {
    name: "FIND_PACKAGES",
    description: "Finds all of the packages in the mono repo",
    run: async (sharedInformation) => {

        log.settings.scope = 'FIND_PACKAGES'

        // We are using the `glob` package to find all of the `package.json` files in the mono repo.
        // We will use the `monoRepoPackages` property to find the `package.json` files.
        // We will then create a new Package for each of the `package.json` files we find.

        if (sharedInformation.isMonoRepo) {
            log.debug('This is a monoRepo')
            // We will loop through the packages in the monorepo and find all of the `package.json` files.

            sharedInformation.monoRepoPackages.forEach((packageGlob: string) => {
                log.info('Searching for packages', 'location', packageGlob)
                const foundSubPackages = glob.sync(ep(sharedInformation.monoRepoRoot, packageGlob, 'package.json'));
                // We will now create a new Package for each of the `package.json` files we found.
                log.info(`Found packages`, 'amount', foundSubPackages.length)
                foundSubPackages.forEach((packagePath: string) => {

                    let newPkg = new Package(packagePath, log);

                    sharedInformation.packages = {
                        ...sharedInformation.packages,
                        [newPkg.name]: newPkg
                    }
                });
            });
        } else {
            log.info('This is not a monoRepo')
            // We will create a new Package for the `package.json` file in the current directory.
            let newPkg = new Package(ep(sharedInformation.monoRepoRoot, 'package.json'), log);
            sharedInformation.packages = {
                [newPkg.name]: newPkg
            }
        }

        return true
    }
} as Step;