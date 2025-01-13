"use server";

import { uploadToCloudinary } from "@/lib/cloudinary/config";
import { db } from "@/lib/firebase/config";
import { Course } from "@/lib/models/Course";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";

export async function uploadCourse(courseFormData: FormData) {
  try {
    const course = new Map();

    course.set("title", courseFormData.get("title") as string);
    course.set("price", courseFormData.get("price") as string);
    course.set("description", courseFormData.get("title") as string);
    course.set(
      "videoSections",
      JSON.parse(courseFormData.get("videoSections") as string)
    );
    course.set("thumbnail", courseFormData.get("thumbnail") as File);

    if (
      !course.get("title") ||
      !course.get("price") ||
      !course.get("description") ||
      !course.get("thumbnail") ||
      !course.get("videoSections")
    ) {
      throw new Error("Missing course data");
    }

    const videoSections = course.get("videoSections") as Array<{
      title: string;
      videoUrl: string;
    }>;
    const updatedVideoSections = videoSections.map((section, index) => {
      return {
        title: section.title,
        videoUrl: section.videoUrl,
        id: index,
      };
    });

    course.set("videoSections", updatedVideoSections);

    const thumbnail = course.get("thumbnail") as File;

    const fileBuffer = await thumbnail.arrayBuffer();
    const mimeType = thumbnail.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, "thumbnails");

    if (!res) {
      throw new Error("Error uploading thumbnail");
    }

    const thumbnailUrl = res.secure_url;

    const courseId = uuid();
    const newCourse: Course = {
      id: courseId,
      title: course.get("title"),
      price: course.get("price"),
      description: course.get("description"),
      thumbnail: thumbnailUrl,
      videoSections: course.get("videoSections"),
    };

    const docRef = doc(db, "courses", courseId);
    await setDoc(docRef, newCourse);

    return {
      success: true,
      data: newCourse,
      message: "Course created",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error creating course",
    };
  }
}
