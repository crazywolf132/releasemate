import { defaultConfig } from '@consts'
import { ep } from './easyPath';
import { existsSync } from 'fs-extra';

/**
 * This is used to read the config from the file system
 * if it does not exist... we will fallback to the default config.
 */

export const readConfig = () => {

    if (existsSync(ep('.github', 'release.config.js'))) {
        // This will set the releaseConfig to the config file
        return require(ep('.github', 'release.config.js'));
    }

    return defaultConfig

}