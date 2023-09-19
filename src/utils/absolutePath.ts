import { ep } from './easyPath';

export const absolutePath = (path: string) => ep(path).replace(process.cwd(), '.');