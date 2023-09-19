import type { Step } from '@types';
import { logger, topologicalSort } from '@utils';

const log = logger('DEEP_LINK_PACKAGES');

export default {
    name: "DEEP_LINK_PACKAGES",
    description: "Sorts the packages in the mono repo",
    run: async (sharedInformation) => {

        topologicalSort(sharedInformation.packages);

        return true
    }
} as Step