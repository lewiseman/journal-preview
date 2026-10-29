import { useMagnet } from "../hooks";
import { LINKS, APK } from "../site";
import { Android, GitHub } from "./Icons";

export function DownloadButton({ compact = false, className = "" }) {
  const ref = useMagnet(0.25);
  return (
    <a
      ref={ref}
      className={`btn btn--primary ${className}`}
      href={LINKS.apk}
      download
      aria-label={`Download Journal ${APK.version} for ${APK.platform}, ${APK.size}. ${APK.requirements}`}
      title={`Journal ${APK.version} · ${APK.requirements}`}
    >
      <Android />
      {compact ? "Get the APK" : "Download APK"}
      {!compact && <small>{APK.size}</small>}
    </a>
  );
}

export function GitHubButton({ label = "View on GitHub", short = "GitHub", href = LINKS.github, className = "btn--ghost" }) {
  const ref = useMagnet(0.25);
  return (
    <a ref={ref} className={`btn ${className}`} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      <GitHub />
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
