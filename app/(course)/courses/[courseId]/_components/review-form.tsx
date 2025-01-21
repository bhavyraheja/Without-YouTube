import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

interface ReviewFormProps {
  courseId: string; // ID of the course being reviewed
  onClose: () => void; // Callback to close the form
  userId: string; // ID of the logged-in user
}

const ReviewForm: React.FC<ReviewFormProps> = ({ courseId, onClose, userId }) => {
  const [rating, setRating] = useState(5); // Default rating
  const [hoverRating, setHoverRating] = useState<number | null>(null); // Hover state for stars
  const [reviewText, setReviewText] = useState(""); // Review text
  const [error, setError] = useState<string | null>(null); // Error handling
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Reset success message
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, rating, reviewText }),
      });

      if (response.ok) {
        setSuccessMessage("Thank you for your feedback!"); // Set success message
        onClose(); // Close the form on success
        setReviewText(""); // Clear the review text after submission
        setRating(5); // Reset rating to default
        toast.success("Review Submitted!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Unable to submit your review. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form bg-white p-6 rounded-md shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Share Your Feedback</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>} {/* Success message */}
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4 text-center">
          <p className="font-medium mb-2">How would you rate this course?</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoverRating(num)}
                onMouseLeave={() => setHoverRating(null)}
                className="focus:outline-none"
                aria-label={`Rate ${num} stars`}
              >
                <FaStar
                  size={30}
                  className={`${
                    (hoverRating || rating) >= num ? "text-yellow-400" : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text Area */}
        <div className="mb-4">
          <label htmlFor="reviewText" className="block font-medium mb-2">
            What did you think about the course?
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Write your review here..."
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;