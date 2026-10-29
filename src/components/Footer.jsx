import { art, LINKS } from "../site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <a href="#hero" className="flex items-center gap-2">
          <img src={art("j.png")} alt="" className="size-8" />
          <img src={art("journal.png")} alt="Journal" className="h-5 w-auto" />
        </a>
        <nav aria-label="Footer">
          <a href={LINKS.apk} download>
            Download APK
          </a>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <p className="hand text-xl text-[#cfaa62]">a place for you · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
