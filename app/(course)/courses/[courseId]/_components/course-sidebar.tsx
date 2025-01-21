"use client"; // This line must be the first line in the file

import { Chapter, Course, UserProgress } from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import ReviewForm from "./review-form";
import { useState } from "react";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
  userId: string; // Add userId prop
  purchase: any; // Adjust type as necessary
}

export const CourseSidebar = ({
  course,
  progressCount,
  userId,
  purchase,
}: CourseSidebarProps) => {
  const isCourseCompleted = course.chapters.every(
    (chapter) => chapter.userProgress?.[0]?.isCompleted
  );

  // State to manage the visibility of the review form
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const handleOpenReviewForm = () => {
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
  };

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">{course.title}</h1>
          {/* Review Button */}
          {isCourseCompleted && (
            <div>
              <button
                onClick={handleOpenReviewForm}
                className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
              >
                Leave a Review
              </button>
            </div>
          )}
        </div>

        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
      {/* Full-Screen Review Form */}
      {isReviewFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
            <button
              onClick={handleCloseReviewForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
            <ReviewForm courseId={course.id} onClose={handleCloseReviewForm} userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};