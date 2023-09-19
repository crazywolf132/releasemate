import { readFileSync } from "fs-extra";
import { ep } from './easyPath';

export const readFile = (path: string): string => {
    return readFileSync(ep(path), 'utf-8');
}