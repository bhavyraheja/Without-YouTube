import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId } = params;
    const { title, description, questions } = await req.json();

    // Validate title
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    // Validate questions
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "At least one question is required." }, { status: 400 });
    }

    // Create the quiz
    const quiz = await db.quiz.create({
      data: {
        title,
        description,
        chapterId,
      },
    });

    // Process each question
    for (const question of questions) {
      const { questionText, options, correctOption } = question;

      // Validate question text and options
      if (!questionText || !Array.isArray(options) || options.length < 2) {
        return NextResponse.json({ error: "Each question must have at least two options." }, { status: 400 });
      }

      // Validate correct option
      if (!options.includes(correctOption)) {
        return NextResponse.json({ error: "Correct option must be one of the provided options." }, { status: 400 });
      }

      // Create the question
      const quizQuestion = await db.question.create({
        data: {
          quizId: quiz.id,
          questionText,
          correctOption: correctOption, // Store the index of the correct option
        },
      });

      // Create the options for the question
      const optionsData = options.map(option => ({
        questionId: quizQuestion.id,
        optionText: option,
      }));

      // Bulk create options
      await db.option.createMany({
        data: optionsData,
      });
    }

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("[QUIZ_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create quiz", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chapterId } = params;

    // Fetch quizzes for the specified chapter
    const quizzes = await db.quiz.findMany({
      where: { chapterId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("[QUIZ_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}