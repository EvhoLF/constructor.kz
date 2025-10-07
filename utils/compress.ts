import { compressToUTF16, decompressFromUTF16 } from 'lz-string';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compress = (data: any) => compressToUTF16(JSON.stringify(data));
export const decompress = (data: string | null | undefined) => {
  if (!data) return [];
  const decompressed = decompressFromUTF16(data);
  return decompressed ? JSON.parse(decompressed) : [];
}