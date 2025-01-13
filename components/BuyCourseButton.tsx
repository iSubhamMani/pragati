"use client";

import { buyCourse } from "@/actions/buyCourse";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const BuyCourseButton = ({ courseId }: { courseId: string }) => {
  async function handleBuyCourse() {
    const res = await buyCourse(courseId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message || "Error purchasing course");
    }
  }

  return (
    <Button onClick={handleBuyCourse} className="w-full" size="lg">
      Enroll Now
    </Button>
  );
};

export default BuyCourseButton;
