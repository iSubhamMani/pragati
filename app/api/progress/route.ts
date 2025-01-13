import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { handleError } from "@/utils/handleError";
import { BadRequestError, UnauthorizedError } from "@/utils/Error";
import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    const { courseId, sid } = await req.json();

    if (!courseId || !sid) {
      throw new BadRequestError();
    }

    const purchasedCourseQuery = query(
      collection(db, "purchasedCourses"),
      where("id", "==", courseId),
      where("purchasedBy", "==", session.user.email)
    );
    const purchasedCourse = await getDocs(purchasedCourseQuery);

    if (purchasedCourse.empty) {
      throw new UnauthorizedError();
    }

    // Update progress
    const courseData = purchasedCourse.docs[0].data() as PurchasedCourse;
    const updatedVideoSections = courseData.videoSections.map((section) =>
      section.id === sid ? { ...section, isCompleted: true } : section
    );
    const courseRef = purchasedCourse.docs[0].ref;
    // Update the document in Firestore
    await updateDoc(courseRef, {
      videoSections: updatedVideoSections,
    });

    return NextResponse.json({ message: "Progress updated" }, { status: 200 });
  } catch (error) {
    handleError(error as Error);
  }
}
