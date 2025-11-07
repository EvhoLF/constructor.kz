import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from "@/prisma/prisma";


export async function POST(req: Request) {
  const { name, email, password, role = 'user' } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role == 'admin' ? 'admin' : 'user',
    },
  });

  return NextResponse.json({ success: true });
}
