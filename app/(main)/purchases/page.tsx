import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import PurchasedCourseCard from "@/components/PurchasedCourseCard";
import { db } from "@/lib/firebase/config";
import { PurchasedCourse } from "@/lib/models/PurchasedCourse";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";

async function fetchMyLibrary() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const purchasesRef = collection(db, "purchasedCourses");
    const purchaseQuery = query(
      purchasesRef,
      where("purchasedBy", "==", session.user.email)
    );

    const purchases = await getDocs(purchaseQuery);

    if (purchases.docs.length === 0) {
      throw new Error("No purchases found");
    }

    const purchasesData = purchases.docs.map((doc) => doc.data());
    return purchasesData as PurchasedCourse[];
  } catch {
    return null;
  }
}

const MyLibrary = async () => {
  const purchasedCourses = await fetchMyLibrary();

  if (!purchasedCourses) {
    return (
      <div className="text-center font-bold text-secondary-foreground text-2xl mt-6">
        No purchase found
      </div>
    );
  }

  return (
    purchasedCourses.length > 0 && (
      <main className="max-w-6xl mx-auto mt-10 px-4 md:px-6">
        <h1 className="fade-pullup text-2xl text-center font-bold mb-6">
          My Purchases
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedCourses.map((purchasedCourse) => {
            return (
              <PurchasedCourseCard
                key={purchasedCourse.id}
                {...purchasedCourse}
              />
            );
          })}
        </div>
      </main>
    )
  );
};

export default MyLibrary;
