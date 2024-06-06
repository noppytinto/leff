import React from "react";
import { Card } from "./Card";

type Props = {
  text: string;
};

export function ErrorMessage({ text }: Props) {
  return (
    <Card className="flex flex-col justify-center gap-4 border-red-600 bg-red-50">
      <p className="font-bold text-red-500">{text}</p>
    </Card>
  );
}
