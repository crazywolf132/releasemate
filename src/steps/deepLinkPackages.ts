import type { Step } from '@types';
import { topologicalSort } from '@utils';
import log from 'volog';

export default {
    name: "DEEP_LINK_PACKAGES",
    description: "Sorts the packages in the mono repo",
    run: async (sharedInformation) => {

        log.settings.scope = 'DEEP_LINK_PACKAGES'

        log.info(`Deep linking packages`)
        topologicalSort(sharedInformation.packages);
        log.info("All packages deep linked")
        
        return true
    }
} as Step