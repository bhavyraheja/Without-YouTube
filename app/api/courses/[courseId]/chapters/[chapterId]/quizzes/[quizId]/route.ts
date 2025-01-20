// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";

// // GET handler to fetch the quiz
// export async function GET(
//   req: Request,
//   { params }: { params: { courseId: string; chapterId: string; quizId: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { quizId } = params;

//     // Fetch the quiz
//     const quiz = await db.quiz.findUnique({
//       where: { id: quizId },
//       include: {
//         questions: {
//           include: {
//             options: true, // Include options for each question
//           },
//         },
//       },
//     });

//     if (!quiz) {
//       return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
//     }

//     return NextResponse.json(quiz, { status: 200 });
//   } catch (error) {
//     console.error("[QUIZ_FETCH_ERROR]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch quiz", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE handler to delete the quiz
// export async function DELETE(
//   req: Request,
//   { params }: { params: { courseId: string; chapterId: string; quizId: string } }
// ) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { quizId } = params;

//     // Check if the quiz exists
//     const quiz = await db.quiz.findUnique({
//       where: { id: quizId },
//     });

//     if (!quiz) {
//       return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
//     }

//     // Delete the quiz
//     await db.quiz.delete({
//       where: { id: quizId },
//     });

//     return NextResponse.json({ message: "Quiz deleted successfully" }, { status: 204 });
//   } catch (error) {
//     console.error("[QUIZ_DELETION_ERROR]", error);
//     return NextResponse.json(
//       { error: "Failed to delete quiz", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// GET handler to fetch the quiz
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { quizId } = params;

    // Fetch the quiz
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true, // Include options for each question
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("[QUIZ_FETCH_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to fetch quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE handler to delete the quiz
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { quizId } = params;

    // Check if the quiz exists
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Delete the quiz
    await db.quiz.delete({
      where: { id: quizId },
    });

    return NextResponse.json({ message: "Quiz deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[QUIZ_DELETION_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to delete quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
