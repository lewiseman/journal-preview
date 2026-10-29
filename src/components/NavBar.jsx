import { useEffect, useRef, useState } from "react";
import { art, LINKS } from "../site";
import { scrollTo } from "../scroll";
import { DownloadButton } from "./Buttons";
import { GitHub } from "./Icons";

export default function NavBar() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progress = useRef(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // clear over the hero (its wordmark flies into the bar), solid after it
      const heroEnd = window.innerHeight * 1.05;
      setSolid(y > heroEnd);
      // tuck away while reading downward, return on any scroll up
      setHidden(y > heroEnd * 1.2 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
      if (progress.current)
        progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = (e) => {
    e.preventDefault();
    scrollTo(0);
  };

  return (
    <>
      <div ref={progress} className="nav__progress" aria-hidden="true" />
      <header className={`nav ${solid ? "nav--solid" : ""} ${hidden ? "nav--hidden" : ""}`}>
        <div className="nav__bar">
          <a href="#hero" className="nav__brand" onClick={toTop} aria-label="Journal, back to top">
            <img src={art("journal.png")} alt="Journal" />
          </a>

          <div className="nav__actions">
            <a className="nav__icon" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="Journal on GitHub">
              <GitHub />
            </a>
            <DownloadButton compact />
          </div>
        </div>
      </header>
    </>
  );
}
