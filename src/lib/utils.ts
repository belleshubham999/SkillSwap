import { clsx } from 'clsx';
export const cn = (...items: Array<string | undefined | false>) => clsx(items);
