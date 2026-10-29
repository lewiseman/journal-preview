import React from "react";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/NavBar.jsx";
import Book from "./components/Book.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
const App = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Book />
    </main>
  );
};
export default App;
