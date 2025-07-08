import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import bcrypt from 'bcrypt';
import { authOptions } from '@/libs/auth';
import { getServerSession } from "next-auth/next";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  console.log(session);
  
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, password, currentPassword } = body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = { name, email };

    if (password) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Введите текущий пароль' }, { status: 400 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 400 });
      }

      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления', message: `${error}` }, { status: 500 });
  }
}
