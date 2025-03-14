// 'use server'

// import { NextResponse } from "next/server";

// // import prisma from "@/prisma/db/prisma-client";
// // import { Prisma } from "@prisma/client";

// export async function POST(req: Request) {
//   try {
//     const { projects } = await req.json();

//     if (!projects || !Array.isArray(projects)) {
//       return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
//     }

//     console.log("projects", projects);

//     // const createdProjects = await prisma.project.createMany({
//     //   data: projects.map((p) => ({
//     //     id: p.id,
//     //     userId: p.userId,
//     //     dateRequest: new Date(p.dateRequest),
//     //     equipmentType: p.equipmentType || "",
//     //     nameObject: p.nameObject,
//     //     direction: p.direction,
//     //     deliveryType: p.deliveryType,
//     //     contact: p.contact,
//     //     phone: p.phone || "",
//     //     email: p.email || null,
//     //     amountCP: isNaN(p.amountCP) ? new Prisma.Decimal(0) : new Prisma.Decimal(p.amountCP),
//     //     delta: isNaN(p.delta) ? new Prisma.Decimal(0) : new Prisma.Decimal(p.delta),
//     //     projectStatus: p.projectStatus,
//     //     comments: p.comments,
//     //     lastDateConnection: p.lastDateConnection ? new Date(p.lastDateConnection) : null,
//     //     plannedDateConnection: p.plannedDateConnection ? new Date(p.plannedDateConnection) : null,
//     //   })),
//     // });
//     return NextResponse.json({ success: true });
//     // return NextResponse.json({ success: true, created: createdProjects.count });
//   } catch (error) {
//     console.error("Ошибка при загрузке проектов:", error);
//     return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
//   }
// }

// app/api/upload-excel/route.ts
// app/api/upload-excel/route.ts

// app/api/upload-excel/route.ts

import * as formidable from "formidable";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Отключаем стандартный парсер тела
  },
};

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads";
  form.keepExtensions = true;

  console.log("Запрос:", req);

  return new Promise<NextResponse>((resolve, reject) => {
    const reader = req.body.getReader();
    const stream = new ReadableStream({
      start(controller) {
        reader.read().then(function processText({ done, value }) {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          reader.read().then(processText);
        });
      },
    });

    form.parse(stream, (err, fields, files) => {
      if (err) {
        console.error("Ошибка при загрузке файла:", err);
        return reject(
          new NextResponse("Ошибка загрузки файла", { status: 500 })
        );
      }

      console.log("Загруженные файлы:", files);
      return resolve(
        new NextResponse(
          JSON.stringify({ message: "Файл загружен успешно!", files }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      );
    });
  });
}
