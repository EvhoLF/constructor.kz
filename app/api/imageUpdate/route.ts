import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { ALLOWED_FOLDERS, ImageUploadType } from "@/constants/upload";
import { prisma } from "@/prisma/prisma";

export const runtime = "nodejs";

/**
 * Ожидает:
 * {
 *   id: number;
 *   type: 'diagram' | 'ontology' | 'kanban' | 'templateDiagram' | 'templateOntology';
 *   imageUrl: string;
 * }
 */

function getModelByType(type: ImageUploadType) {
    const modelMap = {
        [ImageUploadType.DIAGRAM]: prisma.diagram,
        [ImageUploadType.ONTOLOGY]: prisma.ontology,
        [ImageUploadType.TEMPLATE_DIAGRAM]: prisma.templateDiagram,
        [ImageUploadType.TEMPLATE_ONTOLOGY]: prisma.templateOntology,
    };

    return modelMap[type];
}
function isValidModelType(type: string): type is ImageUploadType {
    return Object.values(ImageUploadType).includes(type as ImageUploadType);
}


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id, type, imageUrl } = await req.json();

        if (!id || !type || !imageUrl)
            return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });

        // Проверяем валидность типа
        if (!isValidModelType(type)) {
            return NextResponse.json({ error: "Неизвестный тип" }, { status: 400 });
        }

        const model: any = getModelByType(type);
    
        const updated = await model.update({
            where: { id: Number(id) },
            data: { image: imageUrl },
        });

        return NextResponse.json({ success: true, updated });
    } catch (error) {
        console.error("Ошибка обновления изображения:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}
