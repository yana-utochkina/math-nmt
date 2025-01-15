// Read-запит на діставання інфи про юзера
// Update-запит на зміну профіля (можна змінити firstName, nickname)
// Delete-запит на видалення з бд

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

// Read-запит на діставання інфи про юзера(для профілю)
export const GET = async (req: Request) => {
try {
  // Getting parameter from a request
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
    if (!userId) {
        return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        //password?
        nickname: true,
        firstName: true,
      },
    });

    // If the user is not found
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), 
    { status: 200 });

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch user" }),
      { status: 500 });
  }
}

const isValidName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z0-9]+$/;
  return name.length <= 20 && nameRegex.test(name);
};

// Update-запит на зміну профіля (в профілі можна змінити firstName, nickname)
export const PUT = async(req: Request) => {
    try {
      const { id, firstName, nickname } = await req.json();
      if (!id) {
        return new NextResponse(
          JSON.stringify({ error: "User ID is required" }),
          { status: 400 });
      }

    if (firstName && !isValidName(firstName)) {
      return new NextResponse(
        JSON.stringify({
          error: "Name must include: A-Z,a-z,0-9 and must be up to 20 symbols",}),
        { status: 400 });
    }

    if (nickname && !isValidName(nickname)) {
      return new NextResponse(
        JSON.stringify({
          error: "Nickname must include: A-Z,a-z,0-9 and must be up to 20 symbols",}),
        { status: 400 });
    }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            firstName: firstName !== undefined ? firstName : undefined,
            nickname: nickname !== undefined ? nickname : undefined,
        },
      });
  
      return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to update user" }),
        { status: 500 });
    }
  }

  // Delete-запит на видалення з бд


  export const DELETE = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse(JSON.stringify({ message: "User id is invalid" }), { status: 400 });
        }

        const user = await prisma.user.delete({
            where: { id: id },
        });

        return new NextResponse(JSON.stringify({ message: "User deleted", user: user }), { status: 200 });
    }
    catch (error: any) {
        return new NextResponse("Error in deleting user" + error.message, { status: 500 });
    }
};

// export const DELETE = async(req: Request) => {
//   try {
//     const { id } = await req.json();
      
//     if (!id) {
//       return new NextResponse(
//         JSON.stringify({ error: "User ID is required" }),
//         { status: 400 });
//       }

//     const deletedUser = await prisma.user.delete({
//       where: { id : id},
//     });
//       return NextResponse.json(deletedUser, { status: 200 });
//   } catch (error:any) {
//     return new NextResponse(
//       JSON.stringify({ error: "Failed to delete user" }),
//       { status: 500 });
//   }
// }