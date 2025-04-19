# Weather-App

```import Experience from "./_components/experience";
import Intro from "./_components/intro";
import Projects from "./_components/projects";
import Socials from "./_components/socials";

export default function Home() {
  return (
    <div>
      <Intro />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
        <Experience />
        <Projects />
      </div>
      <Socials />
    </div>
  );
}
