"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import VideoSection from "./VideoSection";
import { uploadCourse } from "@/actions/uploadCourse";
import toast from "react-hot-toast";

export default function CourseForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [videoSections, setVideoSections] = useState([
    { title: "", videoUrl: "" },
  ]);

  const handleAddVideoSection = () => {
    setVideoSections([...videoSections, { title: "", videoUrl: "" }]);
  };

  const handleVideoSectionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedSections = [...videoSections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setVideoSections(updatedSections);
  };

  const handleDeleteVideoSection = (index: number) => {
    if (videoSections.length > 1) {
      const updatedSections = videoSections.filter((_, i) => i !== index);
      setVideoSections(updatedSections);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    const courseFormData = new FormData();
    courseFormData.append("title", title);
    courseFormData.append("price", price);
    courseFormData.append("description", description);
    courseFormData.append("thumbnail", thumbnail as Blob);
    courseFormData.append("videoSections", JSON.stringify(videoSections));

    const uploadPromise = uploadCourse(courseFormData);

    toast.promise(uploadPromise, {
      loading: "Uploading course...",
      success: () => {
        setTitle("");
        setPrice("");
        setThumbnail(null);
        setDescription("");
        setVideoSections([{ title: "", videoUrl: "" }]);
        return "Course uploaded successfully";
      },
      error: "Error uploading course",
    });

    await uploadPromise;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="font-medium"
        />
      </div>
      <div>
        <Label htmlFor="price">Course Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="font-medium"
        />
      </div>
      <div>
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="font-medium"
        />
      </div>
      <div>
        <Label htmlFor="thumbnail">Course Thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setThumbnail(e.target.files[0]);
            }
          }}
          required
          className="font-medium"
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Video Sections</h2>
        {videoSections.map((section, index) => (
          <VideoSection
            key={index}
            section={section}
            onChange={(field, value) =>
              handleVideoSectionChange(index, field, value)
            }
            onDelete={() => handleDeleteVideoSection(index)}
            canDelete={videoSections.length > 1}
          />
        ))}
        <Button type="button" onClick={handleAddVideoSection} variant="outline">
          Add Video Section
        </Button>
      </div>
      <Button type="submit">Create Course</Button>
    </form>
  );
}
