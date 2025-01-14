// Read-запит на діставання id та description завдань конкретної теми та прогрес кожного завдання
// 
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/db";

export async function get(req) {
  const { id: topicId } = req.params;
  const tasks = await prisma.task.findMany({
    where: {
      topicID: topicId,
    },
    select: {
      id: true,
      description: true,
      progress: true,
    },
  });

  return NextResponse.json(tasks);
}



// GPT
// export async function GET(req, { params }) {
//   const { topicId } = params;

//   try {
//     // Validate input
//     if (!topicId) {
//       return NextResponse.json(
//         { error: "Missing topicId parameter" },
//         { status: 400 }
//       );
//     }

//     // Fetch tasks for the specific topic
//     const tasks = await prisma.task.findMany({
//       where: { topicID: topicId }, // Ensure topicId is a number
//       select: {
//         id: true,
//         description: true,
//         progress: true,
//       },
//     });

//     // Return tasks in the response
//     return NextResponse.json(tasks);

//   } catch (error) {
//     // Handle errors and respond with a 500 status
//     console.error("Error fetching tasks:", error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching tasks" },
//       { status: 500 }
//     );
//   }
// }