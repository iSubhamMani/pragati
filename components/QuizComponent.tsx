"use client";

import axios from "axios";
import { useState } from "react";
import { Quiz } from "@/lib/models/Quiz";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import QuizQuestion from "./QuizQuestion";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import toast from "react-hot-toast";

const QuizComponent = ({
  courseTitle,
  videoSectionTitles,
  courseId,
}: {
  courseTitle: string;
  videoSectionTitles: string[];
  courseId: string;
}) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [unanswered, setUnanswered] = useState<number>(0);
  const [retake, setRetake] = useState<boolean>(false);

  const form = useForm({});

  async function generateQuiz() {
    try {
      const fd = new FormData();
      fd.append("courseTitle", courseTitle);
      fd.append("videoSectionTitles", videoSectionTitles.join(", "));
      const res = await axios.post("/api/generate/quiz", fd);

      if (res.data.success) {
        setQuiz(JSON.parse(res.data.data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCorrectAnswers(0);
      setIncorrectAnswers(0);
      setUnanswered(0);
      setLoading(false);
      setRetake(false);
      setSubmitted(false);
      form.reset();
      setCurrentQuestionIndex(0);
    }
  }

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const onSubmit = async () => {
    if (!quiz) return;

    setLoading(true);
    let correct_answers = 0;
    let incorrect_answers = 0;
    let unanswered = 0;

    Object.entries(form.getValues()).forEach(([, value], index) => {
      if (value === quiz.questions[index]?.correctAnswer.toString()) {
        correct_answers++;
      } else if (
        value !== null &&
        value !== quiz.questions[index]?.correctAnswer.toString()
      ) {
        incorrect_answers++;
      } else {
        unanswered++;
      }
    });

    setCorrectAnswers(correct_answers);
    setIncorrectAnswers(incorrect_answers);
    setUnanswered(unanswered);

    if (unanswered === 5) {
      toast("You didn't answer any question", {
        icon: "🤔",
        duration: 3000,
        position: "bottom-right",
      });
      setLoading(false);
      setSubmitted(true);
      setRetake(true);
      return;
    }

    if (correct_answers <= 1) {
      toast(
        "You need to answer at least 2 questions correctly to earn your certificate",
        {
          icon: "📜",
          duration: 5000,
          position: "bottom-right",
        }
      );

      setLoading(false);
      setSubmitted(true);
      setRetake(true);
      return;
    }

    try {
      const res = await axios.patch("/api/quiz/progress", { courseId });

      if (res.data.success) {
        setCorrectAnswers(correct_answers);
        setIncorrectAnswers(incorrect_answers);
        setUnanswered(unanswered);
        setSubmitted(true);

        form.reset();
        setCurrentQuestionIndex(0);
      }
    } catch {
      console.log("Error submitting quiz");
    } finally {
      setLoading(false);
    }
  };

  if (!quiz) {
    return (
      <div className="">
        <p className="font-medium text-secondary-foreground text-lg text-center">
          Click on the Start Quiz button to start your Quiz
        </p>
        <div className="flex justify-center mt-6">
          <Button
            disabled={loading}
            className="font-bold"
            onClick={() => {
              setLoading(true);
              generateQuiz();
            }}
          >
            {loading ? (
              <LoaderCircle className="animate-spin w-5 h-5 text-primary-foreground" />
            ) : (
              "Start Quiz"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    quiz && (
      <Card className="w-[768px] mx-auto">
        {!submitted && (
          <>
            <CardHeader>
              <h2 className="text-xl font-bold">Generated Quiz</h2>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mt-4 md:mt-6">
                <div>
                  <button
                    type="button"
                    className="bg-primary/25 rounded-full p-1 disabled:bg-primary/0"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="text-primary w-5 h-5" />
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="bg-primary/25 rounded-full p-1 disabled:bg-primary/0"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex >= quiz.questions.length - 1}
                  >
                    <ArrowRight className="text-primary w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                      <QuizQuestion
                        question={quiz.questions[currentQuestionIndex]}
                      />
                    </div>

                    {currentQuestionIndex === quiz.questions.length - 1 && (
                      <Button className="mt-4" type="submit">
                        {loading ? (
                          <LoaderCircle className="animate-spin w-5 h-5 text-primary-foreground" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    )}
                  </form>
                </FormProvider>
              </div>
            </CardContent>
          </>
        )}
        {submitted && (
          <>
            <CardHeader>
              <h2 className="text-lg font-bold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="font-medium text-lg text-primary">
                  Correct Answers: {correctAnswers} / {quiz.questions.length}
                </div>

                <div className="font-medium text-lg text-red-600">
                  Incorrect Answers: {incorrectAnswers}
                </div>
                <div className="font-medium text-lg text-secondary-foreground">
                  Unanswered: {unanswered}
                </div>
              </div>
            </CardContent>
            {retake && (
              <CardFooter className="flex justify-end">
                <Button
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    generateQuiz();
                  }}
                >
                  {loading ? (
                    <LoaderCircle className="animate-spin w-5 h-5 text-primary-foreground" />
                  ) : (
                    "Retake Quiz"
                  )}
                </Button>
              </CardFooter>
            )}
          </>
        )}
      </Card>
    )
  );
};

export default QuizComponent;
