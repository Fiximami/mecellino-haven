import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  if (compact) {
    return (
      <Image
        src="/brand/mecellino-haven-mark.png"
        alt=""
        width={1024}
        height={1024}
        className="h-9 w-auto"
        priority
      />
    );
  }

  return (
    <>
      <Image
        src="/brand/mecellino-haven-mark.png"
        alt=""
        width={1024}
        height={1024}
        className="h-9 w-auto md:hidden"
        priority
      />
      <Image
        src="/brand/mecellino-haven-logo.png"
        alt=""
        width={2775}
        height={840}
        className="hidden h-9 w-auto md:block md:h-10"
        priority
      />
    </>
  );
}
