"use client";
import { useCallback, useEffect, useState } from "react";
import { getApiRadioList } from "@/helpers/functions";
import { IconArrowBack, IconArrowBackUp, IconArrowLeft, IconHome, IconSquareRoundedArrowLeft } from "@tabler/icons-react";
import { categoryType } from "@/types/deezerApiTypes";
import Link from "next/link";
import Category from "../Category/Category";
import ScrollableContainer from "../Common/ScrollableContainer";

export default function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);

  const handleUpdatePage = useCallback(async () => {
    const { data } = await getApiRadioList(true);
    setCategoryList(data);
  }, []);

  useEffect(() => {
    handleUpdatePage();
  }, []);

  return (
    <ScrollableContainer>
      <div className="flex justify-center items-center gap-2 mb-8">
        <Link href={`/`}>
          <button type="button">
            <IconSquareRoundedArrowLeft className="w-8 h-8" />
          </button>
        </Link>
        <h1 className="flex-grow text-3xl font-bold text-center text-sky-500 text-shadow-black">Music Categories</h1>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryList.map((category: categoryType) => (
          <Category key={category.id} {...category} />
        ))}
      </div>
    </ScrollableContainer>
  );
}
