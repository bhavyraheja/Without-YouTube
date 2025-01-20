"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";

import QuizList from "./display-quiz";


interface QuizFormProps {
  chapterId: string;
  courseId: string;
  chapterTitle: string;
  
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(1, "Question text is required"),
        options: z
          .array(z.string().min(1, "Option text is required"))
          .min(2, "At least two options are required"),
        correctOption: z.string().min(1, "Correct option is required"),
      })
    )
    .min(1, "At least one question is required"),
});

export const QuizForm = ({
  chapterId,
  courseId,
  chapterTitle,
}: QuizFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: chapterTitle,
      description: "",
      questions: [
        { questionText: "", options: ["", "", "", ""], correctOption: "" },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const {
    fields: questions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Validate that the correct option is one of the provided options
    for (const question of values.questions) {
      if (!question.options.includes(question.correctOption)) {
        toast.error("Correct option must be one of the provided options.");
        return;
      }
    }

    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/quizzes`,
        values
      );
      toast.success("Quiz created successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Failed to create quiz");
      console.error("Error creating quiz:", error);
    }
  };


  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h2>Quiz Creation</h2>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Add Quiz
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Quiz Title"
                      {...field}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Quiz Description"
                      {...field}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {questions.map((question, index) => (
              <div key={question.id} className="border p-4 rounded-md">
                <FormField
                  control={control}
                  name={`questions.${index}.questionText`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type="text"
                          placeholder={`Question ${index + 1}`}
                          {...field}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <label className="block text-sm font-medium mt-2">
                  Options
                </label>
                {question.options.map((option, optionIndex) => (
                  <FormField
                    key={optionIndex}
                    control={control}
                    name={`questions.${index}.options.${optionIndex}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            {...field}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {/* Correct Option */}
                <FormField
                  control={control}
                  name={`questions.${index}.correctOption`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type="text"
                          placeholder="Enter Correct Option"
                          {...field}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Remove Question */}
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 bg-red-500 text-white p-2 rounded"
                >
                  Remove Question
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                append({
                  questionText: "",
                  options: ["", "", "", ""],
                  correctOption: "",
                })
              }
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Add Question
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-4 bg-green-500 text-white p-2 rounded"
            >
              Create Quiz
            </Button>
          </form>
        </Form>
      )}
      <div><QuizList chapterId={chapterId} courseId={courseId} /></div>
    </div>
  );
};

export default QuizForm;
