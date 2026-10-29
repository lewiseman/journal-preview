import { art, LINKS, APK } from "../site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <a href="#hero" className="flex items-center gap-2">
          <img src={art("j.png")} alt="" className="size-8" />
          <img src={art("journal.png")} alt="Journal" className="h-5 w-auto" />
        </a>
        <nav aria-label="Footer">
          <a href={LINKS.releases} target="_blank" rel="noreferrer">Releases & installation</a>
          <a href="/privacy.html">Privacy policy</a>
          <a href="/terms.html">Terms of service</a>
        </nav>
        <p className="text-sm">Journal {APK.version} · {APK.requirements}</p>
        <p className="hand text-xl text-[#cfaa62]">a place for you · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
