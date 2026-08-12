import { permanentRedirect } from "next/navigation";

/** Legacy path — keep for old links/bookmarks. */
export default function TerminalRedirectPage() {
  permanentRedirect("/interactive");
}
