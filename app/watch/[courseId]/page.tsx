import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/VideoPlayer";
import { db } from "@/lib/firebase/config";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CheckCircle, MoveLeft, PlayCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function fetchCourseData(courseId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) throw new Error("Unauthorized");

    const purchaseRef = collection(db, "purchasedCourses");
    const purchaseQuery = query(
      purchaseRef,
      where("id", "==", courseId),
      where("purchasedBy", "==", session.user.email)
    );

    const purchase = await getDocs(purchaseQuery);

    if (purchase.empty) throw new Error("Unauthorized");

    return purchase.docs[0].data() as PurchasedCourse;
  } catch {
    return null;
  }
}

const WatchLayout = async ({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const sectionId = Number((await searchParams).sid as string);
  const courseId = (await params).courseId;
  const courseData = await fetchCourseData(courseId);

  if (!sectionId) {
    return (
      <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(125,210,94,0.3),rgba(255,255,255,0))]">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center font-bold text-2xl">Invalid URL</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(125,210,94,0.3),rgba(255,255,255,0))]">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center font-bold text-2xl">
            Oops! Looks like we couldn&apos;t find the course you are looking
            for.
          </p>
          <div className="flex justify-center my-6">
            <Link href={"/home"}>
              <Button className="font-bold">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sectionUrl = courseData.videoSections[sectionId - 1]?.videoUrl || null;

  if (!sectionUrl) {
    return (
      <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(125,210,94,0.3),rgba(255,255,255,0))]">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center font-bold text-2xl">Invalid URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(125,210,94,0.3),rgba(255,255,255,0))]">
      <div className="container mx-auto py-6 px-4">
        <div className="w-max my-6">
          <Link href={"/purchases"}>
            <div className="p-2 hover:bg-primary/20 rounded-md text-secondary-foreground font-bold flex items-center gap-2">
              <MoveLeft className="size-6" /> <span>Back</span>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <VideoPlayer url={sectionUrl} courseId={courseId} sid={sectionId} />
          {/* Course Content Section */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">
                  {courseData.title}
                </h3>
                <p className="text-lg font-medium my-2">Sections</p>{" "}
                <div className="max-h-[350px] overflow-y-auto">
                  {courseData.videoSections.map((section, index) => (
                    <Link
                      href={`/watch/${courseId}?sid=${index + 1}`}
                      key={section.id}
                    >
                      <div>
                        <div className="bg-gray-200 py-2 px-4 rounded-lg flex items-center gap-2">
                          {section.isCompleted ? (
                            <CheckCircle className="size-5 text-green-600" />
                          ) : (
                            <PlayCircle className="size-5 text-gray-700" />
                          )}
                          <span className="font-medium text-base line-clamp-1">
                            {section.title}
                          </span>
                        </div>
                        {index !== courseData.videoSections.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLayout;
