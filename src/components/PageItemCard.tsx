import React, { ReactEventHandler } from "react";
import { PageItem } from "../entities/item";
import { Card } from "./ui/Card";
import { Favicon } from "./ui/Favicon";

type Props = {
  pageItem: PageItem;
  onError?: ReactEventHandler<HTMLImageElement>;
  showThumbnail?: boolean;
};

export function PageItemCard({
  pageItem,
  onError,
  showThumbnail = true,
}: Props) {
  return (
    <Card className="flex flex-col justify-center gap-4 ">
      <div className="flex items-center gap-2">
        {/*======================================= FAVICON */}
        <Favicon src={pageItem.favicon} />

        {/*======================================= TITLE */}
        <p className="line-clamp-1 text-lg font-bold">{pageItem.title}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        {/*======================================= DESCRIPTION */}
        <p className=" line-clamp-4 self-start text-wrap text-sm">
          {pageItem.description}
        </p>

        {/*======================================= THUMBNAIL */}
        {showThumbnail && (
          <img
            src={pageItem.image}
            alt="image"
            className="max-w-[120px] self-stretch rounded-md object-cover shadow-md"
            onError={onError}
          />
        )}
      </div>
    </Card>
  );
}
