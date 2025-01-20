// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// const ChapterIdPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const [quizData, setQuizData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [score, setScore] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchQuizData = async () => {
//       if (!params?.courseId || !params?.chapterId || !params?.quizId) {
//         setError("Missing required parameters.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `/api/courses/${params.courseId}/chapters/${params.chapterId}/quizzes/${params.quizId}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch quiz data");
//         }
//         const data = await response.json();
//         setQuizData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : String(err));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizData();
//   }, [params?.courseId, params?.chapterId, params?.quizId]);

//   const handleOptionChange = (questionId: number, option: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: option,
//     }));
//   };

//   const handleSubmit = () => {
//     if (!quizData?.questions) return;

//     let calculatedScore = 0;
//     quizData.questions.forEach((question: any) => {
//       const selectedAnswerIndex = question.options.findIndex(
//         (option: any) => answers[question.id] === option.optionText
//       );

//       if (selectedAnswerIndex === question.correctOptionIndex) {
//         calculatedScore += 1;
//       }
//     });

//     setScore(calculatedScore);
//   };

//   const handleReturnToChapter = () => {
//     router.push(`/courses/${params.courseId}/chapters/${params.chapterId}`);
//   };

//   if (loading) {
//     return <p className="text-center text-lg">Loading...</p>;
//   }

//   if (error) {
//     return <p className="text-center text-lg text-red-500">Error: {error}</p>;
//   }

//   if (!quizData || !quizData.questions?.length) {
//     return <p className="text-center text-lg">No quiz data available.</p>;
//   }

//   return (
//     <div className="p-6 mx-auto max-w-3xl">
//       <button
//         onClick={handleReturnToChapter}
//         className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
//       >
//         Return to Chapter
//       </button>
//       <h1 className="text-2xl font-bold text-center mb-4">Quiz</h1>
//       <p className="text-lg text-gray-600 text-center mb-8">
//         There are 4 options. You have to choose one:
//       </p>
//       <div className="space-y-8">
//         {quizData.questions.map((question: any, index: number) => (
//           <div key={question.id} className="bg-gray-100 p-4 rounded shadow-md">
//             <h2 className="text-lg font-semibold mb-4">
//               {`Q${index + 1}: ${question.questionText}`}
//             </h2>
//             <ul className="space-y-2">
//               {question.options.map((option: any, optionIndex: number) => (
//                 <li key={`${question.id}-${optionIndex}`}>
//                   <label className="flex items-center space-x-3">
//                     <input
//                       type="radio"
//                       name={`question-${index}`}
//                       value={option.optionText}
//                       checked={answers[question.id] === option.optionText || false}
//                       onChange={() => handleOptionChange(question.id, option.optionText)}
//                       className="w-4 h-4"
//                     />
//                     <span className="text-gray-800">{option.optionText}</span>
//                   </label>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-6"
//       >
//         Submit
//       </button>
//       {score !== null && (
//         <div className="mt-6 text-center">
//           <p className="text-xl font-bold">
//             Your Score: {score} / {quizData.questions.length}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChapterIdPage;

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const ChapterIdPage = () => {
  const router = useRouter();
  const params = useParams();
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!params?.courseId || !params?.chapterId || !params?.quizId) {
        setError("Missing required parameters.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/courses/${params.courseId}/chapters/${params.chapterId}/quizzes/${params.quizId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        setQuizData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [params?.courseId, params?.chapterId, params?.quizId]);

  const handleOptionChange = (questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    if (!quizData?.questions) return;

    let calculatedScore = 0;
    quizData.questions.forEach((question: any) => {
      // Directly compare the selected answer with the correct option
      if (answers[question.id] === question.correctOption) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
  };

  const handleReturnToChapter = () => {
    router.push(`/courses/${params.courseId}/chapters/${params.chapterId}`);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  if (!quizData || !quizData.questions?.length) {
    return <p className="text-center text-lg">No quiz data available.</p>;
  }

  return (
    <div className="p-6 mx-auto max-w-3xl">
      <button
        onClick={handleReturnToChapter}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-6"
      >
        Return to Chapter
      </button>
      <h1 className="text-2xl font-bold text-center mb-4">Quiz</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        There are 4 options. You have to choose one:
      </p>
      <div className="space-y-8">
        {quizData.questions.map((question: any, index: number) => (
          <div key={question.id} className="bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              {`Q${index + 1}: ${question.questionText}`}
            </h2>
            <ul className="space-y-2">
              {question.options.map((option: any) => (
                <li key={`${question.id}-${option.optionText}`}>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.optionText}
                      checked={answers[question.id] === option.optionText || false}
                      onChange={() => handleOptionChange(question.id, option.optionText)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-800">{option.optionText}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mt-6"
      >
        Submit
      </button>
      {score !== null && (
        <div className="mt-6 text-center">
          <p className="text-xl font-bold">
            Your Score: {score} / {quizData.questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChapterIdPage;
