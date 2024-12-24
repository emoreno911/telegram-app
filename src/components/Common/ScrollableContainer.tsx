import { PropsWithChildren } from "react";

export default function  ScrollableContainer (
    { children }: PropsWithChildren
) { 
  return (
    <div className="w-full overflow-auto z-10">
      <div className="w-full max-w-2xl mx-auto bg-transparent py-6 px-3 md:px-6">
      	{ children }
      </div>
    </div>
    )
}