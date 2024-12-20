import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string} }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", {
        status: 401,
      });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId },
      include:{
        chapters:{
          include:{
            muxData:true,
          }
        }
      }
    });
    if (!course) {
      return new NextResponse(" not found", {
        status: 404,
      });
    }

    const haspublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

    if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !haspublishedChapter){
      return new NextResponse("Missing required fields",{status : 401});
    }


    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data:{
        isPublished: true,
      }
    })

    return NextResponse.json(publishedCourse);

  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
