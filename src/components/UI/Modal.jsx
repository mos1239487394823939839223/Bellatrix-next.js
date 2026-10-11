import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = "default",
  showCloseButton = true,
  className = "",
  overlayClassName = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  const MotionDiv = motion.div;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <MotionDiv
            className={`fixed inset-0 bg-black transition-opacity ${overlayClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <MotionDiv
              className={`adm-dark dark relative w-full ${sizeClasses[size]} bg-[var(--adm-surface,#0b1a3f)] border border-[var(--adm-border-strong,rgba(255,255,255,0.2))] rounded-xl shadow-2xl ${className}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              {...props}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--adm-border,rgba(255,255,255,0.1))]">
                  {title && (
                    <h2 className="text-base font-semibold text-[var(--adm-text,#fff)]">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="h-8 w-8 text-[var(--adm-text-muted,#fff)] hover:bg-white/10 hover:text-white"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </MotionDiv>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ModalHeader = ({ children, className = "" }) => (
  <div className={`border-b border-[var(--adm-border,rgba(255,255,255,0.1))] pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = "" }) => (
  <div
    className={`border-t border-[var(--adm-border,rgba(255,255,255,0.1))] pt-4 mt-4 flex justify-end space-x-2 ${className}`}
  >
    {children}
  </div>
);

export default Modal;
export { ModalHeader, ModalFooter };
