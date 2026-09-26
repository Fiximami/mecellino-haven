import Image from "next/image";
import { editorialImages, type EditorialImageId } from "@/config/editorial-images";
import { cn } from "@/lib/utils";

export type { EditorialImageId };

export function EditorialPhoto({
  imageId,
  priority = false,
  onNavy = false,
  className,
}: {
  imageId: EditorialImageId;
  priority?: boolean;
  onNavy?: boolean;
  className?: string;
}) {
  const image = editorialImages[imageId];

  return (
    <figure className={cn("mh-editorial", onNavy && "mh-editorial-on-navy", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={image.sizes}
        priority={priority}
        className="mh-editorial-img"
        style={{ objectPosition: image.objectPosition }}
      />
    </figure>
  );
}
