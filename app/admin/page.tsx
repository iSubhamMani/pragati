import CourseForm from "@/components/CourseForm";
import React from "react";

const Admin = () => {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard - Add New Course
        </h1>
        <CourseForm />
      </div>
    </div>
  );
};

export default Admin;
