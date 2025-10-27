import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { prisma } from "@/prisma/prisma"
import { ErrorWithStatus } from "./ErrorWithStatus"

export async function checkAccessFetch(targetUserId: number) {
  const session = await getServerSession(authOptions); // <- убрали req

  if (!session || !session.user) {
    throw new ErrorWithStatus("Not authenticated", 401)
  }

  const sessionUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  if (!sessionUser) {
    throw new ErrorWithStatus("User not found", 401)
  }

  const isOwner = sessionUser.id === targetUserId
  const isAdmin = sessionUser.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new ErrorWithStatus("Forbidden", 403)
  }

  return sessionUser
}
