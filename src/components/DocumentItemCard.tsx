import { DocumentItem, FileItem, ImageItem } from "../entities/item";
import Image from "next/image";

type Props = {
  documentItem: DocumentItem;
};

export function DocumentItemCard({ documentItem }: Props) {
  return (
    <div className=" justify-censter flex flex-col items-center gap-2 p-4">
      <div className="relative flex h-[200px] w-[150px] flex-col items-center justify-center gap-2 rounded-md rounded-tr-3xl border border-solid border-gray-300 p-4">
        <p className="absolute -left-[.5em] top-4 rounded-md rounded-bl-md border border-gray-100 bg-gray-100 px-4 py-1 text-sm font-bold text-gray-600 shadow-md">
          .{documentItem.extension}
        </p>
        <p className="w-full truncate text-wrap text-center text-sm font-bold text-gray-500">
          {documentItem.name}
        </p>
      </div>
      <a
        href={documentItem.src}
        target="_blank"
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Open
      </a>
    </div>
  );
}
