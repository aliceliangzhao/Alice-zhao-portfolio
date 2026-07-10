import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import PhotoMarqueeStrip from "./PhotoMarqueeStrip";

/* About-section photo strip. This is a server component: at build time it reads
   every image in PHOTO_DIR and measures it with sharp, so dropping a new photo
   into that folder makes it appear on the next build — no code change needed.
   Files are shown in filename order, so prefix with 01_, 02_, ... to control
   the sequence. The measured pixel ratio becomes each item's aspect ratio, so
   the fixed-height row never distorts or crops a photo.

   The actual animated strip lives in the PhotoMarqueeStrip client component. */

const PHOTO_DIR = "public/img/aboutMe/me";
const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

// "seattle-center.jpg" -> "Seattle Center" (a reasonable auto alt/caption)
function humanize(file) {
  return file
    .replace(IMG_RE, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function PhotoMarquee() {
  const dir = path.join(process.cwd(), PHOTO_DIR);
  const files = fs
    .readdirSync(dir)
    .filter((f) => IMG_RE.test(f))
    .sort();

  const photos = await Promise.all(
    files.map(async (file) => {
      const { width, height } = await sharp(path.join(dir, file)).metadata();
      return {
        src: `/${PHOTO_DIR.replace(/^public\//, "")}/${file}`,
        ar: `${width} / ${height}`,
        alt: humanize(file),
      };
    })
  );

  if (photos.length === 0) return null;
  return <PhotoMarqueeStrip photos={photos} />;
}
