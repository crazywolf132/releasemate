import { logger } from '@utils';
import type { SharedInformation, Step } from '@types'
import { SharedInformationImpl } from './sharedInformation';
import Steps from '@steps'

/**
 * Creating a logger to be used by the CORE system
 */
const log = logger('CORE');

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
        log('Starting the release process');

        for (const step of this.steps) {
            const stepLogger = logger(step.name);
            let overallLogger = stepLogger(`Starting step...`);
            try {
                const result = await step.run(this.sharedInformation);
                // overallLogger(result);
            } catch (e) {
                // overallLogger(false);
                console.log(e)
                throw new Error(`Step ${step.name} failed`, { "cause": 'Please refer to the docs' });
            }

        }
    }

}