"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { db } from "@/lib/firebase/config";
import { Course } from "@/lib/models/Course";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";

export async function buyCourse(courseId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    const courseDetails = courseSnap.data() as Course;

    if (!courseSnap.exists()) {
      throw new Error("Course not found");
    }

    const purchasesRef = collection(db, "purchasedCourses");
    const purchaseQuery = query(
      purchasesRef,
      where("id", "==", courseId),
      where("purchasedBy", "==", session.user.email)
    );
    const isPurchased = await getDocs(purchaseQuery);

    if (isPurchased.docs.length !== 0) {
      throw new Error("Course already purchased");
    }

    // Add course to user's purchased courses

    const purchasedCourse: PurchasedCourse = {
      ...courseDetails,
      purchasedBy: session.user.email!,
      purchasedAt: new Date().toISOString(),
      amount: courseDetails.price,
      videoSections: courseDetails.videoSections.map((section, index) => ({
        ...section,
        id: index + 1,
        isCompleted: false,
      })),
    };

    await addDoc(collection(db, "purchasedCourses"), purchasedCourse);

    return {
      success: true,
      message: "Course purchased successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error purchasing course",
    };
  }
}
