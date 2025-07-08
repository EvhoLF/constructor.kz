import { compressToUTF16, decompressFromUTF16 } from 'lz-string';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compress = (data: any) => compressToUTF16(JSON.stringify(data));
export const decompress = (data: string) => JSON.parse(decompressFromUTF16(data));
