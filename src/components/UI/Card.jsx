import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = true,
  padding = "default",
  shadow = "default",
  ...props
}) => {
  const baseClasses =
    "bg-[var(--adm-surface,rgba(255,255,255,0.1))] rounded-xl border border-[var(--adm-border,rgba(255,255,255,0.2))] transition-colors duration-200";

  const paddingClasses = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    default: "",
    lg: "shadow-lg",
  };

  const hoverClasses = hover ? "hover:border-[var(--adm-border-strong,rgba(255,255,255,0.3))]" : "";

  const cardClasses = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    hoverClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const MotionComponent = motion.div;

  return (
    <MotionComponent
      className={cardClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-[var(--adm-border,rgba(255,255,255,0.1))] pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-base font-semibold text-[var(--adm-text,#fff)] ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-[var(--adm-text-muted,#d1d5db)] mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`border-t border-[var(--adm-border,rgba(255,255,255,0.1))] pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
