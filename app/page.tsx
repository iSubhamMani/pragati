import Footer from "@/components/Footer";
import LoginButton from "@/components/LoginButton";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import Meteors from "@/components/ui/meteors";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative bg-background bg-[radial-gradient(ellipse_90%_90%_at_50%_-20%,rgba(125,210,94,0.3),rgba(255,255,255,0))]">
      <Meteors number={5} />
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(350px_circle_at_center,white,transparent)]"
        )}
      />
      <header className="px-6 lg:px-10 mt-8 flex items-center justify-center">
        <Link className="flex items-center justify-center" href="/">
          <div className="flex items-center gap-2">
            <Image src={"/logo.png"} width={32} height={32} alt="logo" />
            <span className="font-bold text-2xl md:text-3xl text-primary">
              Skillable
            </span>
          </div>
        </Link>
      </header>
      <main className="flex-1 max-w-6xl mx-auto space-y-12">
        <section className="pt-20 md:pt-24 lg:pt-28 xl:pt-32">
          <div className="container px-6 lg:px-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="tracking-wide mb-6 fade-pullup text-4xl text-secondary-foreground font-bold sm:text-5xl md:text-6xl/none xl:text-7xl/none">
                  Empowering Sustainable
                  <br />
                  Urban Futures
                </h1>
                <p className="fade-pullup-delayed-1 font-medium text-secondary-foreground md:text-xl">
                  Because Every Skill Counts Towards a{" "}
                  <span className="text-primary font-bold">Greener</span>{" "}
                  Tomorrow
                </p>
              </div>
              <div className="flex items-center gap-6">
                <LoginButton />
                <Link href={"https://t.me/TJP_WEB3_BOT"} target="_blank">
                  <Button className="font-bold text-primary-foreground">
                    Use Telegram Bot
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-10 mx-4 bg-primary/10 rounded-md shadow-sm">
          <h1 className="fade-pullup-delayed-2 text-2xl font-bold text-secondary-foreground text-center">
            Why <span className="text-primary">Skillable?</span>
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="flex items-center justify-center">
                <div className="bg-primary/20 rounded-full size-16 flex justify-center items-center">
                  <Image
                    src="/holistic.png"
                    width={32}
                    height={32}
                    alt="Holistic"
                  />
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-secondary-foreground text-center">
                Holistic Learning
              </h2>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <div className="bg-primary/20 rounded-full size-16 flex justify-center items-center">
                  <Image
                    src="/sustainable.png"
                    width={32}
                    height={32}
                    alt="Holistic"
                  />
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-secondary-foreground text-center">
                Sustainable Development
              </h2>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <div className="bg-primary/20 rounded-full size-16 flex justify-center items-center">
                  <Image
                    src="/expert.png"
                    width={32}
                    height={32}
                    alt="Holistic"
                  />
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-secondary-foreground text-center">
                Expert Insights
              </h2>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
