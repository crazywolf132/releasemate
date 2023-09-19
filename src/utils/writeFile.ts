import { writeFileSync } from "fs-extra";
import { ep } from './easyPath';

export const writeFile = (path: string, content: string): void => {
    writeFileSync(ep(path), content, 'utf-8');
}