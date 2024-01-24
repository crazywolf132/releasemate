
import Steps from '@steps';
import type { SharedInformation, Step } from '@types';
import log from 'volog';
import { SharedInformationImpl } from './sharedInformation';


/**
 * Creating a logger to be used by the CORE system
*/
log.settings.scope = 'CORE'

/**
 * This system will be used to loop through all the different steps
 * Each step will have a purpose in the release system.
 * 
 * We will keep all the information we need and know here in the release system.
 * We will share it that way.
 */
export class ReleaseMate {
    private static _instance: ReleaseMate;

    /** Private information to keep in the singleton */
    private steps: Step[] = Steps;

    private sharedInformation: SharedInformation = new SharedInformationImpl()

    private constructor() { }

    public static get instance(): ReleaseMate {
        if (!this._instance) {
            this._instance = new ReleaseMate();
        }
        return this._instance;
    }

    public mode(name: string, format: string, dryRun: boolean) {
        this.sharedInformation.dryRun = dryRun;
        this.sharedInformation.versionFormat = format;
        this.sharedInformation.releaseType = name;
    }

    public async run() {
        log.info('Starting the release process');

        for (const step of this.steps) {
            log.settings.scope = step.name;
            log.info(`Starting step`, `stepName`, step.name);
            try {
                await step.run(this.sharedInformation);
            } catch (e) {
                console.log(e)
                throw new Error(`Step ${step.name} failed`, { "cause": 'Please refer to the docs' });
            }

        }
    }

}