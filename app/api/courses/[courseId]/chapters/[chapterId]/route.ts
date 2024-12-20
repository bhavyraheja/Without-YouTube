import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    throw new Error("Mux credentials are missing in environment variables.");
}

const mux = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

type Params = { params: { courseId: string; chapterId: string } };

// Delete Chapter Handler
export async function DELETE(req: Request, { params }: Params) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
        }

        // Verify ownership of the course
        const ownCourse = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized: User does not own this course", { status: 401 });
        }

        // Check if the chapter exists
        const chapter = await db.chapter.findUnique({
            where: { id: params.chapterId, courseId: params.courseId },
        });
        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        // Handle existing video and associated Mux data
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId: params.chapterId },
            });
            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }
        }

        // Delete the chapter
        const deletedChapter = await db.chapter.delete({
            where: { id: params.chapterId },
        });

        // Unpublish the course if no published chapters remain
        const remainingPublishedChapters = await db.chapter.findMany({
            where: { courseId: params.courseId, isPublished: true },
        });

        if (remainingPublishedChapters.length === 0) {
            await db.course.update({
                where: { id: params.courseId },
                data: { isPublished: false },
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.error("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Update Chapter Handler
export async function PATCH(req: Request, { params }: Params) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
        }

        // Verify ownership of the course
        const ownCourse = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized: User does not own this course", { status: 401 });
        }

        // Update chapter details
        const updatedChapter = await db.chapter.update({
            where: { id: params.chapterId },
            data: { ...values },
        });

        // Handle Mux video upload if videoUrl is provided
        if (values.videoUrl) {
            // Delete existing Mux asset and related data if present
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId: params.chapterId },
            });
            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }

            // Create a new Mux asset
            const asset = await mux.video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });

            // Save Mux asset data to the database
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
        }

        return NextResponse.json(updatedChapter);
    } catch (error) {
        console.error("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
