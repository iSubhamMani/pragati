import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import QuizComponent from "@/components/QuizComponent";
import { db } from "@/lib/firebase/config";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";
import React from "react";

async function getQuiz(courseId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) throw new Error("Unauthorized");

    const purchasedCourseQuery = query(
      collection(db, "purchasedCourses"),
      where("id", "==", courseId),
      where("purchasedBy", "==", session.user.email),
      where("isCompleted", "==", true),
      where("isQuizAttempted", "==", false)
    );

    const purchasedCourse = await getDocs(purchasedCourseQuery);

    if (purchasedCourse.empty) throw new Error("Unauthorized");
    const courseData = purchasedCourse.docs[0].data() as PurchasedCourse;

    const courseTitle = courseData.title;
    const videoSectionTitles = courseData.videoSections.map(
      (section) => section.title
    );

    // generate Quiz

    return { courseTitle, videoSectionTitles };
  } catch {
    return null;
  }
}

const QuizPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const courseId = (await params).courseId;

  if (!courseId) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
        <p className="text-lg font-bold text-secondary-foreground">
          Invalid URL
        </p>
      </div>
    );
  }

  const courseDetails = await getQuiz(courseId);

  if (!courseDetails) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
        <p className="text-lg font-bold text-secondary-foreground">
          Either you have attempted the quiz already or you are not eligible for
          it
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
      <QuizComponent {...courseDetails} courseId={courseId} />
    </div>
  );
};

export default QuizPage;
