import React from "react";
import Image from "next/image";

type Props = {
  src: string;
};

// TODO: should I expose the alt prop?
export function Favicon({ src }: Props) {
  return (
    <Image
      loader={() => src}
      src={src}
      alt="favicon"
      // TODO: fix duplicated width and height values
      className="min-h-[18px] min-w-[18px] rounded-sm object-contain"
      width={18}
      height={18}
    />
  );
}
