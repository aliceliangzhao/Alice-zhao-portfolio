import Navigation from "./components/Navigation";
import EditorialIntro from "./components/EditorialIntro";
import SelectedWork from "./components/SelectedWork";
import EditorialAbout from "./components/EditorialAbout";
import PhotoMarquee from "./components/PhotoMarquee";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <EditorialIntro />
        <SelectedWork />
        <EditorialAbout />
        <PhotoMarquee />
      </main>
    </>
  );
}
