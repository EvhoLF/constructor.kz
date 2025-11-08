import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

export async function ensureOwnership(
    model: "diagram" | "funnel" | "kanban" | "ontology",
    id: string | number
) {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/signin");

    let entity: { userId: number } | null = null;

    switch (model) {
        case "diagram":
            entity = await prisma.diagram.findUnique({ where: { id: Number(id) }, select: { userId: true } });
            break;
        case "funnel":
            entity = await prisma.funnel.findUnique({ where: { id: Number(id) }, select: { userId: true } });
            break;
        case "kanban":
            entity = await prisma.kanban.findUnique({ where: { id: Number(id) }, select: { userId: true } });
            break;
        case "ontology":
            entity = await prisma.ontology.findUnique({ where: { id: Number(id) }, select: { userId: true } });
            break;
    }

    if (!entity || (entity.userId !== user.id && user.role !== "admin")) {
        redirect("/profile");
    }

    return user;
}
