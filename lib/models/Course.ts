export interface Course {
  id: string;
  title: string;
  price: string;
  description: string;
  thumbnail: string;
  videoSections: { title: string; videoUrl: string; id: string }[];
}
