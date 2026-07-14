import Navigation from "./components/Navigation";
import EditorialIntro from "./components/EditorialIntro";
import SelectedWork from "./components/SelectedWork";
import PreviousWork from "./components/PreviousWork";
import EditorialAbout from "./components/EditorialAbout";
import PhotoMarquee from "./components/PhotoMarquee";
import Connect from "./components/Connect";
import SectionDivider from "./components/SectionDivider";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <EditorialIntro />
        <SelectedWork />
        <SectionDivider label="Previous work" />
        <PreviousWork />
        <SectionDivider label="About" id="about" />
        <EditorialAbout />
        <PhotoMarquee />
        <SectionDivider label="Connect" id="connect" />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
