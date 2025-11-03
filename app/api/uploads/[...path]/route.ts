// app/api/uploads/[...path]/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathParams } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    let filePath: string;

    if (!pathParams || !Array.isArray(pathParams)) {
      // Если путь не указан, сразу берем заглушку
      filePath = path.join(process.cwd(), "public", "images", "no-image.jpg");
    } else {
      const decodedPath = pathParams.map(p => decodeURIComponent(p));
      filePath = path.join(process.cwd(), "uploads", ...decodedPath);

      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        // Если файл не найден или это не файл — берем заглушку
        filePath = path.join(process.cwd(), "public", "images", "no-image.jpg");
      }
    }

    const stats = fs.statSync(filePath);
    const mimeType = getMimeType(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": stats.size.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response("Internal server error", { status: 500 });
  }
}


function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
  };
  return mimeTypes[ext] || "application/octet-stream";
}