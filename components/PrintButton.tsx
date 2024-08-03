"use client";

export function PrintButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="print-hidden"
      onClick={() => {
        window.print();
      }}
    >
      {children}
    </button>
  );
}
