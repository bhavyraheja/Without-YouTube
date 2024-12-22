import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

// Validate MUX environment variables
if (!process.env.MUX_TOKEN_ID?.trim() || !process.env.MUX_TOKEN_SECRET?.trim()) {
    throw new Error("Mux credentials are missing or empty in environment variables.");
}

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

// DELETE Handler
export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId, // Ensure the course belongs to the user
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Delete associated MUX assets
        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await mux.video.assets.delete(chapter.muxData.assetId);
            }
        }

        // Delete the course
        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
                userId, // Ensure the user can delete only their course
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.error("[COURSE_ID_DELETE_ERROR]", error.message);
        return new NextResponse(
            JSON.stringify({ error: "Failed to delete the course", details: error.message }),
            { status: 500 }
        );
    }
}

// PATCH Handler
export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;
        const values = await req.json();

        const course = await db.course.update({
            where: {
                id: courseId,
                userId, // Ensure the user can update only their course
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID_PATCH_ERROR]", error.message);
        return new NextResponse(
            JSON.stringify({ error: "Failed to update the course", details: error.message }),
            { status: 500 }
        );
    }
}
