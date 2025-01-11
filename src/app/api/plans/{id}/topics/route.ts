// Read-запит на діставання json {title, progress(групувати по темі в таблиці UserTopicTask)}
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";

export async function get(req) {
  const { id } = req.params;
  const plan = await prisma.plan.findMany({
    where: {
      userId: id,
    },
    select: {
      title: true,
      progress: {
        select: {
          topicId: true,
          progress: true,
        },
      },
    },
  });

  return NextResponse.json(plan);
}



//GPT
// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
// Validate input
//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing user ID parameter" },
//         { status: 400 }
//       );
//     }

// Fetch plans with grouped progress
//     const plans = await prisma.plan.findMany({
//       where: {
//         userId: id, // Ensure id is a number
//       },
//       select: {
//         title: true,
//         progress: {
//           select: {
//             topicId: true,
//             progress: true,
//           },
//         },
//       },
//     });

// Handle case where no plans are found
//     if (!plans || plans.length === 0) {
//       return NextResponse.json(
//         { error: "No plans found for the given user" },
//         { status: 404 }
//       );
//     }

// Group progress by topicId
//     const groupedProgress = plans.map(plan => ({
//       title: plan.title,
//       progress: plan.progress.reduce((acc, task) => {
//         if (!acc[task.topicId]) {
//           acc[task.topicId] = [];
//         }
//         acc[task.topicId].push(task.progress);
//         return acc;
//       }, {}),
//     }));

// Return grouped data
//     return NextResponse.json(groupedProgress);
//   } catch (error) {
//     console.error("Error fetching plans:", error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching the plans" },
//       { status: 500 }
//     );
//   }
// }