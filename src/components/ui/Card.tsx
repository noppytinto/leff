import React, { PropsWithChildren } from "react";
import { WithClassName } from "../../types/native";

type Props = PropsWithChildren & WithClassName & {};

export function Card({ children, className }: Props) {
  return (
    <div
      className={
        "rounded-md border border-solid border-gray-300 p-4 " + className
      }
    >
      {children}
    </div>
  );
}
