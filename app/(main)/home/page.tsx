import FeaturedCourses from "@/components/FeaturedCourses";
import ShinyHeading from "@/components/ShinyHeading";
import { MoveRight } from "lucide-react";
import Image from "next/image";

const Home = () => {
  return (
    <main className="flex-1 space-y-8">
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <div className="lg:flex-1">
            <div className="relative w-full aspect-[1.4/1] max-w-[560px] mx-auto">
              <Image
                src="/home-hero.svg"
                fill
                priority
                className="object-contain"
                alt="hero illustration"
              />
            </div>
          </div>
          <div className="lg:flex-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium fade-pullup text-primary">
              What Are You Learning Today?
            </h1>
            <p className="fade-pullup mt-4 text-base md:text-lg max-w-xl text-secondary-foreground font-medium">
              Discover courses in sustainable urban development and create
              positive change in your city
            </p>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="text"
                className="flex-1 max-w-sm text-base md:text-lg px-4 py-2 border-2 border-primary/40 rounded-lg placeholder:font-medium"
                placeholder="Search courses.."
              />
              <button className="shadow-md hover:bg-primary/90 rounded-full p-2 bg-primary text-sm text-white flex-shrink-0">
                <MoveRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex justify-center">
          <ShinyHeading className="text-4xl font-medium mb-10">
            Featured Courses
          </ShinyHeading>
        </div>
        <FeaturedCourses />
      </section>
    </main>
  );
};

export default Home;
