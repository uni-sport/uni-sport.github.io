import { ReactNode } from "react";

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-4xl font-bold">{children}</h1>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc list-inside">{children}</ul>;
}

