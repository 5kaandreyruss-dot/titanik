import { ButtonHTMLAttributes } from "react";

type Variant = "default" | "primary" | "danger";

export function Button({
  variant = "default",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const variantClass = variant === "primary" ? "btn-primary" : variant === "danger" ? "btn-danger" : "";
  return <button className={`btn ${variantClass} ${className}`} {...props} />;
}
