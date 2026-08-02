import Image from "next/image";

export function BrandLogo({
  size = 36,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/icons/predim-nec-logo.svg"
      alt="CivilKit EC"
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-[22%] ${className}`}
    />
  );
}
