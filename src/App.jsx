import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
import Book from "./components/Book.jsx";
import Screens from "./components/Screens.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import { startSmoothScroll } from "./scroll";

const App = () => {
  useEffect(() => {
    const stop = startSmoothScroll();
    // pinned scenes measure the page; re-measure once images have settled
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      stop();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <main>
      <NavBar />
      <Hero />
      <Book />
      <Screens />
      <Features />
      <Footer />
    </main>
  );
};

export default App;
