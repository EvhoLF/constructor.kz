import { deleteFileIfExists, extractFilePathFromUrl } from '@/libs/file-utils';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_string } = await params;
  const id = parseInt(id_string);
  const item = await prisma.templateDiagram.findUnique({ where: { id } });

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_string } = await params;
  const id = parseInt(id_string);
  const body = await req.json();
  const { title, category, nodes, edges } = body;

  const updated = await prisma.templateDiagram.update({
    where: { id },
    data: {
      ...(title && { title }), ...(category && { category }),
      ...(nodes && { nodes }), ...(edges && { edges }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: id_string } = await params;
  const id = parseInt(id_string);

  // Сначала получаем объект, чтобы узнать путь к файлу
  const template = await prisma.templateDiagram.findUnique({
    where: { id },
    select: { image: true }
  });

  // Удаляем объект из БД
  await prisma.templateDiagram.delete({ where: { id } });

  // Удаляем связанный файл, если он есть
  if (template?.image) {
    const filePath = extractFilePathFromUrl(template.image);
    await deleteFileIfExists(filePath);
  }

  return NextResponse.json({ success: true });
}