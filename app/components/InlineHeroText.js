"use client";

import InlineImageLoop from "./InlineImageLoop";
import ExternalLink from "./ExternalLink";

/* Renders a string with inline tokens:
   - {img:src1,src2,...|url}  -> a looping image strip, linked when a url is given
   - {link:label|url}         -> an external text link
   Each token may carry its own url after a pipe; otherwise it falls back to the
   optional `externalLink` prop. Shared parser for the hero copy and the homepage
   About statement. */
export default function InlineHeroText({ text, externalLink }) {
  const parts = text.split(/(\{img(?::[^}]*)?\}|\{link:[^}]+\})/g);
  return parts.map((part, i) => {
    const imgMatch = part.match(/^\{img:([^}]+)\}$/);
    if (imgMatch) {
      const [srcs, url] = imgMatch[1].split("|");
      const loop = <InlineImageLoop key={i} srcs={srcs.split(",")} />;
      const href = url || externalLink?.url;
      return href
        ? <ExternalLink key={i} href={href} hideIcon dataCursor={externalLink?.cursor}>{loop}</ExternalLink>
        : loop;
    }
    const linkMatch = part.match(/^\{link:([^}]+)\}$/);
    if (linkMatch) {
      const [label, url] = linkMatch[1].split("|");
      const href = url || externalLink?.url;
      return href
        ? <ExternalLink key={i} href={href} dataCursor={externalLink?.cursor}>{label}</ExternalLink>
        : label;
    }
    return part;
  });
}
