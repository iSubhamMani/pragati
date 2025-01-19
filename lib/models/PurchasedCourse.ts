import { Course } from "./Course";

export interface PurchasedCourse
  extends Pick<Course, "id" | "title" | "thumbnail" | "description"> {
  purchasedBy: string;
  purchasedByName: string;
  purchasedAt: string;
  amount: string;
  videoSections: {
    title: string;
    videoUrl: string;
    id: number;
    isCompleted: boolean;
  }[];
  isCompleted: boolean;
  isQuizAttempted: boolean;
  status: "PENDING" | "COMPLETED";
  txnId: string;
}
