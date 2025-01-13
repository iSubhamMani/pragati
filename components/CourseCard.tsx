import { Card } from "@/components/ui/card";
import { Course } from "@/lib/models/Course";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const CourseCard = (course: Course) => {
  return (
    <Card className="overflow-hidden">
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
          <div>
            <span className="font-bold text-lg text-secondary-foreground">
              ₹{course.price}
            </span>
          </div>
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
        </div>
        <div className="flex justify-end mt-4">
          <Link href={`course/${course.id}`}>
            <Button className="font-bold" variant={"default"}>
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
