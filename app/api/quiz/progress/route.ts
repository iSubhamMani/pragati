import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/config";
import { BadRequestError, UnauthorizedError } from "@/utils/Error";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { handleError } from "@/utils/handleError";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    const { courseId } = await req.json();

    if (!courseId) {
      throw new BadRequestError();
    }

    const purchasedCourseQuery = query(
      collection(db, "purchasedCourses"),
      where("id", "==", courseId),
      where("purchasedBy", "==", session.user.email),
      where("isCompleted", "==", true)
    );
    const purchasedCourse = await getDocs(purchasedCourseQuery);

    if (purchasedCourse.empty) {
      throw new UnauthorizedError();
    }

    const courseRef = purchasedCourse.docs[0].ref;
    // Update the document in Firestore
    await updateDoc(courseRef, {
      isQuizAttempted: true,
    });

    return NextResponse.json(
      { message: "Quiz Progress updated", success: true },
      { status: 200 }
    );
  } catch (error) {
    handleError(error as Error);
  }
}
