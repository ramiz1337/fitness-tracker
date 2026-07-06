import type { ReactNode } from "react";

type CardProps = {
    img : string,
    title: string, 
    children: ReactNode;
}

export default function Card({img, title, children} : CardProps) {
    return(
        <div className="flex items-start border border-gray-300 rounded p-3">
            <div className="min-w-10 mt-1 mr-4">
                <img className="w-full" src={img} alt="" />
            </div>
            <div>
                <h1 className="uppercase text-md font-semibold">{title}</h1>
                <p className="text-gray-600 text-sm">{children}</p>
            </div>
        </div>
    )
}