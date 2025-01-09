// Read-запит на отримання плану : (як виглядає план) {діставати прогрес по кожній темі}
// Update-запит на зміну плану (в параметрах hours : int, endDate : DateType????)
// Delete на видалення з бд
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function get(req) {
  const { id } = req.params;
  const plan = await prisma.plan.findUnique({
    where: {
      id,
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

export async function put(req) {
  const { id } = req.params;
  const { hours, endDate } = req.body;

  await prisma.plan.update({
    where: {
      id,
    },
    data: {
      hours,
      endDate,
    },
  });

  return NextResponse.json({ success: true });
}

export async function del(req) {
  const { id } = req.params;

  await prisma.plan.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ success: true });
}



//GPT
// READ - Fetch a plan by ID, including progress for each topic
// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing plan ID" },
//         { status: 400 }
//       );
//     }

//     const plan = await prisma.plan.findUnique({
//       where: { id: id },
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

//     if (!plan) {
//       return NextResponse.json({ error: "Plan not found" }, { status: 404 });
//     }

//     return NextResponse.json(plan);
//   } catch (error) {
//     console.error("Error fetching plan:", error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching the plan" },
//       { status: 500 }
//     );
//   }
// }

// UPDATE - Update a plan's `hours` and `endDate`
// export async function PUT(req, { params }) {
//   const { id } = params;

//   try {
//     const body = await req.json();
//     const { hours, endDate } = body;

//     if (!id || !hours || !endDate) {
//       return NextResponse.json(
//         { error: "Missing required parameters (id, hours, endDate)" },
//         { status: 400 }
//       );
//     }

//     const updatedPlan = await prisma.plan.update({
//       where: { id: id },
//       data: {
//         hours,
//         endDate: new Date(endDate),
//       },
//     });

//     return NextResponse.json(updatedPlan);
//   } catch (error) {
//     console.error("Error updating plan:", error);
//     return NextResponse.json(
//       { error: "An error occurred while updating the plan" },
//       { status: 500 }
//     );
//   }
// }

// DELETE - Delete a plan by ID
// export async function DELETE(req, { params }) {
//   const { id } = params;

//   try {
//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing plan ID" },
//         { status: 400 }
//       );
//     }

//     await prisma.plan.delete({
//       where: { id: id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error deleting plan:", error);
//     return NextResponse.json(
//       { error: "An error occurred while deleting the plan" },
//       { status: 500 }
//     );
//   }
// }