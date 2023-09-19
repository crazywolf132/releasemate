import { join } from 'node:path';
import { cwd } from 'node:process';

export const ep = (...paths: string[]): string => {
    const cleanPaths = paths.map((p: string) => p.replaceAll(cwd(), '').replace(/\/$/, '').replace(/^\//, '')).filter(Boolean);
    return join(cwd(), ...cleanPaths);
}