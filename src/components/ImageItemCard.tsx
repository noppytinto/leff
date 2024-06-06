import { ImageItem } from "../entities/item";
import Image from "next/image";

type Props = {
  imageItem: ImageItem;
};

export function ImageItemCard({ imageItem }: Props) {
  return (
    <div className="relative h-[150px] w-1/4">
      <Image src={imageItem.src} alt="image" fill objectFit="contain" />
    </div>
  );
}
