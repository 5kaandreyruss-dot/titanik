"use client";
import { ReactNode } from "react";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="panel w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-lg sm:rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--panel-border)] p-4 sticky top-0 bg-[var(--panel)]">
          <h2 className="text-[var(--gold)] font-semibold tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-[var(--ink-dim)] text-2xl leading-none px-2">
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
