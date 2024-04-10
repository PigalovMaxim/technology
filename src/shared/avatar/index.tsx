import DefaultUser from "./assets/default_user.png";

export default function Avatar({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src ? src : DefaultUser}
      alt={alt}
      className={className || "g-image"}
    />
  );
}
