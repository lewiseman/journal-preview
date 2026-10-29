import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { APK, art, LINKS } from "../site";
import { finePointer, useReveal } from "../hooks";
import { useOwner } from "../owner";
import { DownloadButton, GitHubButton } from "./Buttons";
import Stars from "./Stars";

export default function Download() {
  const root = useReveal();
  const book = useRef(null);
  const owner = useOwner();
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toString(LINKS.apk, { type: "svg", margin: 0, color: { dark: "#161658", light: "#0000" } })
      .then(setQr)
      .catch(() => {});
  }, []);

  // the cover follows the pointer, with a sheen sliding across it
  useEffect(() => {
    if (!finePointer) return;
    const section = root.current;
    const el = book.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      el.style.transform = `rotateY(${x * 40}deg) rotateX(${-y * 25}deg)`;
      el.style.setProperty("--shine", `${50 - x * 120}%`);
    };
    section.addEventListener("pointermove", move);
    return () => section.removeEventListener("pointermove", move);
  }, [root]);

  return (
    <section id="download" ref={root} className="section section--night">
      <img className="download__sky" src={art("night.jpg")} alt="" loading="lazy" />
      <Stars className="absolute inset-0 h-full w-full" density={4200} />

      <div className="wrap">
        <div className="download__book reveal">
          <div ref={book}>
            {owner && <span className="cover-owner">{owner}</span>}
          </div>
          <img className="download__mascot" src={art("j.png")} alt="" />
        </div>

        <h2 className="display download__title reveal">
          Start your first page<span className="text-[#ffd84a]">.</span>
        </h2>
        <p className="download__sub reveal">
          Journal is free and open source. Grab the APK for your Android phone, or read every line of
          it on GitHub before you do.
        </p>
        <div className="download__cta reveal">
          <DownloadButton />
          <GitHubButton label="Star on GitHub" short="Star on GitHub" />
        </div>

        <div className="install">
          <div className="reveal">
            <em>one</em>
            <b>Download the APK</b>
            <p>
              {APK.size}, straight from the project's GitHub releases.
            </p>
          </div>
          <div className="reveal">
            <em>two</em>
            <b>Allow the install</b>
            <p>Android asks once to install apps from your browser. Say yes to Journal.</p>
          </div>
          <div className="reveal">
            <em>three</em>
            <b>Write your name</b>
            <p>Open Journal, put your name on the cover and turn to the first page.</p>
          </div>
          <div className="qr reveal" aria-hidden={!qr}>
            {qr && <span dangerouslySetInnerHTML={{ __html: qr }} />}
            <span>scan to get it on your phone</span>
          </div>
        </div>
      </div>
    </section>
  );
}
