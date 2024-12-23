"use client";
import { useCallback, useEffect, useState } from "react";
import { getApiRadioList } from "../../app/helpers/functions";
import { IconArrowBack, IconArrowBackUp } from "@tabler/icons-react";
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
        <div className="flex align-center justify-center gap-2">
          <Link href={`/`}>
            <button type="button">
              <IconArrowBackUp className="w-8 h-8" />
            </button>
          </Link>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Music Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categoryList.map((category: categoryType) => (
            <Category key={category.id} {...category} />
          ))}
        </div>
    </ScrollableContainer>
  );
}
