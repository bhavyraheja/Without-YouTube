import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// POST handler to submit a review
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { courseId, rating, reviewText } = await req.json();

    // Validate input
    if (!courseId || !rating) {
      return NextResponse.json({ error: "Course ID and rating are required." }, { status: 400 });
    }

    // Create a new review
    const newReview = await db.review.create({
      data: {
        userId,
        courseId,
        rating,
        reviewText: reviewText || null, // Set reviewText to null if not provided
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("[REVIEW_SUBMISSION_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to submit review",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}