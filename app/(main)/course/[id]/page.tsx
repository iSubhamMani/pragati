import BuyCourseButton from "@/components/BuyCourseButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase/config";
import { Course } from "@/lib/models/Course";
import { doc, getDoc } from "firebase/firestore";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

const fetchCourseDetails = async (id: string) => {
  const courseRef = doc(db, "courses", id);
  const courseSnap = await getDoc(courseRef);

  if (!courseSnap.exists()) return null;

  return courseSnap.data();
};

const CourseDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const courseId = (await params).id;

  const course = (await fetchCourseDetails(courseId)) as Course | null;

  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </CardContent>
          </Card>

          {/* Video Sections */}
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pr-4 max-h-[400px] overflow-y-auto">
                {course.videoSections.map((section, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </div>
                    {index < course.videoSections.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl font-bold">$ {course.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  ✓ <span>Lifetime access</span>
                </li>
                <li className="flex items-center gap-2">
                  ✓ <span>HD video content</span>
                </li>
                <li className="flex items-center gap-2">
                  ✓ <span>Certificate of completion</span>
                </li>
                <li className="flex items-center gap-2">
                  ✓ <span>Project files included</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <BuyCourseButton courseId={courseId} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
