// Create-запит на створення плану (в параметрах hours : int, endDate : DateType????)

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function post(request: Request) {
    try {
        const { hours, endDate } = await request.json();

        if (typeof hours !== 'number' || !(endDate instanceof Date)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const newPlan = await prisma.plan.create({
            data: {
                hours: "",
                endDate: "",
            },
        });

        return NextResponse.json(newPlan, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}



//GPT
// export async function POST(req) {
//   try {
//     // Parse request body
//     const body = await req.json();
//     const { hours, endDate } = body;

// Validate input
//     if (!hours || typeof hours !== "number" || hours <= 0) {
//       return NextResponse.json(
//         { error: "Invalid or missing 'hours' parameter" },
//         { status: 400 }
//       );
//     }

//     if (!endDate || isNaN(Date.parse(endDate))) {
//       return NextResponse.json(
//         { error: "Invalid or missing 'endDate' parameter" },
//         { status: 400 }
//       );
//     }

// Create a new plan
//     const newPlan = await prisma.plan.create({
//       data: {
//         hours,
//         endDate: new Date(endDate), // Ensure endDate is a valid Date object
//       },
//     });

// Return the created plan
//     return NextResponse.json(newPlan, { status: 201 });
//   } catch (error) {
//     console.error("Error creating plan:", error);
//     return NextResponse.json(
//       { error: "An error occurred while creating the plan" },
//       { status: 500 }
//     );
//   }
// }