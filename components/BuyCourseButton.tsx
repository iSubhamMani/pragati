"use client";

import { buyCourse } from "@/actions/buyCourse";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const BuyCourseButton = ({ courseId }: { courseId: string }) => {
  const router = useRouter();

  async function handleBuyCourse() {
    try {
      const res = await buyCourse(courseId);
      if (res.url) {
        router.push(res.url);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button onClick={handleBuyCourse} className="w-full" size="lg">
      Enroll Now
    </Button>
  );
};

export default BuyCourseButton;
