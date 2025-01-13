import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import CourseCard from "./CourseCard";
import { Course } from "@/lib/models/Course";

const getFeaturedCourses = async () => {
  const courses = collection(db, "courses");
  const resource = await getDocs(courses);

  const coursesData = resource.docs.map((doc) => {
    return {
      ...doc.data(),
    };
  });

  return coursesData;
};

const FeaturedCourses = async () => {
  const courses = (await getFeaturedCourses()) as Course[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.length > 0 &&
        courses.map((course) => {
          return <CourseCard key={course.id} {...course} />;
        })}
      {courses.length === 0 && (
        <div>
          <h2>No courses found</h2>
        </div>
      )}
    </div>
  );
};

export default FeaturedCourses;
