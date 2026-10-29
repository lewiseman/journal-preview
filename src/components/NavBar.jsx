import { useEffect, useRef, useState } from "react";
import { art, LINKS } from "../site";
import { scrollTo } from "../scroll";
import { DownloadButton } from "./Buttons";
import { GitHub } from "./Icons";

const LINKS_NAV = [
  { href: "#book", label: "Tour" },
  { href: "#features", label: "Features" },
  { href: "#download", label: "Download" },
];

export default function NavBar() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progress = useRef(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setSolid(y > 40);
      // tuck away while reading downward, return on any scroll up
      setHidden(y > 600 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
      if (progress.current)
        progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <>
      <div ref={progress} className="nav__progress" aria-hidden="true" />
      <header className={`nav ${solid ? "nav--solid" : ""} ${hidden ? "nav--hidden" : ""}`}>
        <div className="nav__bar">
          <a href="#hero" className="nav__brand" onClick={(e) => go(e, 0)} aria-label="Journal, back to top">
            <img src={art("journal.png")} alt="Journal" />
          </a>

          <nav className="nav__links" aria-label="Sections">
            {LINKS_NAV.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            ))}
          </nav>

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
