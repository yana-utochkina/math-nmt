// Read-запит на діставання id та description завдань конкретної теми та прогрес кожного завдання
// 

"use server";
import { NextResponse } from "next/server";
import { prisma } from "@db";

export const GET = async (request: Request) => {
  try {
    const { id, description, progress, topicID } = await request.json();
    const tasks = await prisma.task.findMany({
      where: {
        topicID: topicID,
      },
      select: {
        id: true,
        description: true,
        progress: true,
      },
    });

    return NextResponse.json(tasks);
  }
  catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tasks" },
      { status: 500 }
    );
  }

};


export const POST = async (request: Request) => {
  try {
    const { id, description, progress, topicID } = await request.json();
    const task = await prisma.task.create({
      data: {
        id: id,
        description: description,
        solution: "solution",
        progress: progress,
        topicID: topicID,
        problem: "problem",
      },
    });

    return NextResponse.json(task);
  }
  catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "An error occurred while creating task" },
      { status: 500 }
    );
  }
}
// export async function get(req) {
//   const { id: topicId } = req.params;
//   const tasks = await prisma.task.findMany({
//     where: {
//       topicID: topicId,
//     },
//     select: {
//       id: true,
//       description: true,
//       progress: true,
//     },
//   });

//   return NextResponse.json(tasks);
// }



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