import { isTeacher } from "@/lib/teacher";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Fake auth function for demonstration
const auth = (req: Request) => ({ userId: "fakeId" }); // Adjust as per actual implementation

// Authorization Handler
const handleAuth = () => {
  const { userId } = auth({} as Request); // Mocked `auth` function, adjust accordingly
  const isAuthorized = isTeacher(userId);
  if (!userId || !isAuthorized) {
    throw new Error("Unauthorized: No userId provided");
  }
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Route for uploading a course image
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => {
      try {
        return handleAuth();
      } catch (error) {
        console.error("Middleware Error in courseImage:", error);
        throw error;
      }
    })
    .onUploadComplete(({ file }) => {
      console.log("Course Image Uploaded:", file);
    }),

  // Route for uploading course attachments
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => {
      try {
        return handleAuth();
      } catch (error) {
        console.error("Middleware Error in courseAttachment:", error);
        throw error;
      }
    })
    .onUploadComplete(({ file }) => {
      console.log("Course Attachment Uploaded:", file);
    }),

  // Route for uploading chapter videos
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => {
      try {
        return handleAuth();
      } catch (error) {
        console.error("Middleware Error in chapterVideo:", error);
        throw error;
      }
    })
    .onUploadComplete(({ file }) => {
      console.log("Chapter Video Uploaded:", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
