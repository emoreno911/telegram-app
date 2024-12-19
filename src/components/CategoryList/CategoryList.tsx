"use client";
import { useCallback, useEffect, useState } from "react";
import { getApiRadioList } from "../../app/helpers/functions";
import Category from "../Category/Category";
import { categoryType } from "@/types/deezerApiTypes";

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
    <>
      <div className="bg-sky-500 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Music Categories
        </h1>
        <div className="grid grid-cols-2 gap-4 px-8">
          {categoryList.map((category: categoryType) => (
            <Category key={category.id} {...category} />
          ))}
        </div>
      </div>
    </>
  );
}
