"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Array<{
    questionText: string;
    options: string[];
    correctOptionIndex?: number;
  }>;
}

interface QuizListProps {
  chapterId: string;
  courseId: string;
}

const QuizList = ({ chapterId, courseId }: QuizListProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/quizzes`);
        setQuizzes(response.data);
      } catch (error) {
        toast.error("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [chapterId, courseId]);

  const handleDeleteQuiz = async (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quizzes/${quizId}`);
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
        toast.success("Quiz deleted successfully");
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete quiz");
        console.error("Error deleting quiz:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <h2 className="font-medium">Quizzes for This Chapter</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available for this chapter.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{quiz.title}</h3>
                <p>{quiz.description}</p>
              </div>
              <Button onClick={() => handleDeleteQuiz(quiz.id)} variant="destructive">
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizList;