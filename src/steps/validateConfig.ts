import log from 'volog';

export default {
    name: "VALIDATE_CONFIG",
    description: "Validates the config",
    run: async (sharedInformation: any) => {

        log.settings.scope = 'VALIDATE_CONFIG'

        log.info(`Validating config`);

        if (!sharedInformation.releaseConfig) {
           log.fatal(`No config found`, 'missingConfig', 'Please create a config file in the root of your project');
            return false;
        }

        if (!sharedInformation.releaseConfig.owner){
            log.fatal(`No owner found`, 'missingOwner', 'Please add an owner to your config file');
            return false;
        }

        if (!sharedInformation.releaseConfig.repo){
            log.fatal(`No repo found`, 'missingRepo', 'Please add a repo to your config file');
            return false;
        }

        if (!sharedInformation.releaseConfig.github){
            log.fatal(`No github url found`, 'missingGithub', 'Please add a github url to your config file');
            return false;
        }

        return true;
    }
}