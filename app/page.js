import Navigation from "./components/Navigation";
import EditorialIntro from "./components/EditorialIntro";
import SelectedWork from "./components/SelectedWork";
import PreviousWork from "./components/PreviousWork";
import EditorialAbout from "./components/EditorialAbout";
import PhotoMarquee from "./components/PhotoMarquee";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <EditorialIntro />
        <SelectedWork />
        <PreviousWork />
        <EditorialAbout />
        <PhotoMarquee />
      </main>
      <Footer />
    </>
  );
}
