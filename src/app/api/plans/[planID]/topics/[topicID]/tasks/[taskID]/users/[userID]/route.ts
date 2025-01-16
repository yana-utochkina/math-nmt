// Update-запит на зміну прогресу таски
// Read-запит на діставання прогресу

// import { NextResponse } from "next/server";
// import { prisma } from "../../../../../../../../../../lib/db";

//idea gpt

// export const GET = async (
//     req: Request,
//     { params }: { params: { planID: string; topicID: string; taskID: string; userID: string } }
//   ) => {
//     const { planID, topicID, taskID, userID } = params;
  
//     try {
//       // Перевірка параметрів
//       if (!planID || !topicID || !taskID || !userID) {
//         return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
//       }
  
//       // Перевірка існування плану, теми та таски
//       const plan = await prisma.plan.findUnique({
//         where: { id: planID },
//         include: {
//           Topic: {
//             where: { id: topicID },
//             include: {
//               Task: {
//                 where: { id: taskID },
//               },
//             },
//           },
//         },
//       });
  
//       if (!plan) {
//         return NextResponse.json({ error: "Plan not found" }, { status: 404 });
//       }
  
//     //   if (!plan.Topic.length || !plan.Topic[0].Task.length) {
//     //     return NextResponse.json({ error: "Topic or Task not found" }, { status: 404 });
//     //   }
  
//       // Отримання прогресу для користувача
//       const userTask = await prisma.userTask.findUnique({
//         where: {
//           userID_taskID: {
//             userID,
//             taskID,
//           },
//         },
//         select: { passed_on: true },
//       });
      
  
//       if (!userTask) {
//         return NextResponse.json({ error: "Progress not found for this user and task" }, { status: 404 });
//       }
  
//       // Відповідь з даними
//       return NextResponse.json(
//         {
//           message: "Task progress fetched successfully",
//           data: { passed_on: userTask.passed_on },
//         },
//         { status: 200 }
//       );
//     } catch (error: any) {
//       console.error("Error fetching task progress:", error);
//       return NextResponse.json({ error: "Failed to fetch task progress" }, { status: 500 });
//     }
//   };