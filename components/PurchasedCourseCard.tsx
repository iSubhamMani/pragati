import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import { GrCertificate } from "react-icons/gr";

const PurchasedCourseCard = (course: PurchasedCourse) => {
  const totalSections = course.videoSections.length;
  const completedSections = course.videoSections.reduce((acc, section) => {
    if (section.isCompleted) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const progress = Math.floor((completedSections / totalSections) * 100);

  return (
    <Card className="overflow-hidden fade-pullup-delayed-1">
      <div className="overflow-hidden">
        <Image
          className="object-cover w-full"
          src={course.thumbnail}
          alt={course.title}
          width={300}
          height={200}
        />
      </div>
      <div className="p-4">
        <div>
          <p className="text-lg font-bold">{course.title}</p>
        </div>
        <p className="text-sm line-clamp-1 font-medium text-secondary-foreground">
          {course.description}
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
            <span className="font-medium">
              {course.videoSections.length}{" "}
              {course.videoSections.length === 1 ? "section" : "sections"}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-primary mb-2">
              Progress: {progress}%
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mt-4 gap-4">
          {progress === 100 && (
            <Link href={`/certificate/${course.id}`}>
              <Button
                className="font-bold flex items-center gap-1"
                variant={"default"}
              >
                <GrCertificate className="size-5" />
                Certificate
              </Button>
            </Link>
          )}
          <Link href={`/watch/${course.id}?sid=1`}>
            <Button className="font-bold" variant={"default"}>
              Start Learning
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PurchasedCourseCard;
