
import fs from 'fs/promises';
import path from 'path';

export async function deleteFileIfExists(filePath: string): Promise<boolean> {
  try {
    if (!filePath) return true;
    const fullPath = path.join(process.cwd(), 'uploads', ...filePath.split('/').filter(Boolean));
    try {
      await fs.access(fullPath);
    } catch {
      return true;
    }
    await fs.unlink(fullPath);
    console.log(`Файл удален: ${fullPath}`);
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении файла ${filePath}:`, error);
    return false;
  }
}

export function extractFilePathFromUrl(imageUrl: string | null): string {
  if (!imageUrl) return '';
  return imageUrl.replace(/^\/uploads\//, '');
}