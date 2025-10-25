import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { ALLOWED_FOLDERS, UploadFolder } from "@/constants/upload";

export const runtime = "nodejs";
const BASE_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldImage = formData.get("oldImage") as string | null;
    const folder = formData.get("folder") as string | null;
    const folderNormalized = folder ? folder.replace(/^\/+|\/+$/g, '') : '';

    if (!file) return NextResponse.json({ error: "Файл не найден" }, { status: 400 });

    // ✅ Проверяем папку
    const UPLOAD_DIR = folderNormalized ? path.join(BASE_UPLOAD_DIR, folderNormalized) : BASE_UPLOAD_DIR;

    // ✅ Проверяем размер (до 10 МБ)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes)
      return NextResponse.json({ error: "Файл слишком большой" }, { status: 400 });

    // ✅ Проверяем формат
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
      return NextResponse.json({ error: "Недопустимый формат файла" }, { status: 400 });

    // ✅ Проверяем реальное изображение через sharp
    const bytes = Buffer.from(await file.arrayBuffer());
    const meta = await sharp(bytes).metadata();

    if (!meta.width || !meta.height)
      return NextResponse.json({ error: "Некорректное изображение" }, { status: 400 });
    if (meta.width < 100 || meta.height < 100)
      return NextResponse.json({ error: "Слишком маленькое изображение" }, { status: 400 });

    // ✅ Создаем папку
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // ✅ Генерируем уникальное имя
    const hash = crypto.randomBytes(6).toString("hex");
    const fileName = `${Date.now()}_${hash}.png`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // ✅ Сжимаем и конвертируем
    await sharp(bytes)
      .png({ quality: 90, compressionLevel: 8, adaptiveFiltering: true })
      .resize({ width: 1920, withoutEnlargement: true })
      .toFile(filePath);

    // ✅ Удаляем предыдущий файл, если есть
    if (oldImage) {
      try {
        // Убираем начальный /uploads/ из пути
        const oldRelativePath = oldImage.replace(/^\/uploads\//, '');
        const oldFullPath = path.join(BASE_UPLOAD_DIR, oldRelativePath);

        // Дополнительная проверка безопасности
        if (oldFullPath.startsWith(BASE_UPLOAD_DIR)) {
          await fs.unlink(oldFullPath);
        }
      } catch {
        // ignore
      }
    }

    const fileUrl = `/uploads/${folderNormalized ? `${folderNormalized}/` : ""}${fileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Ошибка при загрузке:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
