// Read-запит на діставання фул інфи про тему (json{ title, theory, progress })
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";

export async function get(req) {
  const { id } = req.params;
  const topic = await prisma.topic.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return NextResponse.json(topic);
}



//GPT
// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     // Validate input
//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing theme ID parameter" },
//         { status: 400 }
//       );
//     }

//     // Fetch theme information
//     const topic = await prisma.topic.findUnique({
//       where: {
//         id: id, // Ensure id is a number
//       },
//       select: {
//         title: true,
//         theory: true,
//         progress: true,
//       },
//     });

//     // Handle case where topic is not found
//     if (!topic) {
//       return NextResponse.json(
//         { error: "Theme not found" },
//         { status: 404 }
//       );
//     }

//     // Return theme information
//     return NextResponse.json(topic);
//   } catch (error) {
//     // Handle errors and respond with a 500 status
//     console.error("Error fetching theme:", error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching the theme" },
//       { status: 500 }
//     );
//   }
// }