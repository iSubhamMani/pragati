import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import Certificate from "@/components/Certificate";
import { db } from "@/lib/firebase/config";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";

async function getCertificate(courseId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) throw new Error("Unauthorized");

    const purchasedCourseQuery = query(
      collection(db, "purchasedCourses"),
      where("id", "==", courseId),
      where("purchasedBy", "==", session.user.email)
    );

    const purchasedCourse = await getDocs(purchasedCourseQuery);

    if (purchasedCourse.empty) throw new Error("Unauthorized");
    const courseData = purchasedCourse.docs[0].data() as PurchasedCourse;
    const isCompleted = courseData.videoSections.every(
      (section) => section.isCompleted
    );

    return isCompleted ? courseData : null;
  } catch {
    return null;
  }
}

const CertificatePage = async ({
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

  const certificate = await getCertificate(courseId);

  if (!certificate) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
        <p className="text-lg font-bold text-secondary-foreground">
          Not eligible for the certificate
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
      <Certificate
        courseTitle={certificate.title}
        name={certificate.purchasedBy}
      />
    </div>
  );
};

export default CertificatePage;
