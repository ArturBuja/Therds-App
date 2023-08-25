"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

interface IProps {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

const Pagination = ({ pageNumber, isNext, path }: IProps) => {
  const router = useRouter();

  const handleNavigation = (type: string) => {
    let nextPageNumber = pageNumber;

    if (type === "next") {
      nextPageNumber += 1;
    } else if (type === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
    }
    if (nextPageNumber > 1) {
      router.push(`/${path}?page=${nextPageNumber}`);
    } else {
      router.push(`/${path}`);
    }
  };
  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="pagination">
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className="!text-small-regular text-light-2"
      >
        Prev
      </Button>
      <p className="text-small-semibold text-light-1">{pageNumber}</p>
      <Button
        className="!text-small-regular text-light-2"
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
