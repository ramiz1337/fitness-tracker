import type { ReactNode } from "react";

type CardProps = {
    img : string,
    children: ReactNode;
}

export default function HeaderCard({img, children} : CardProps) {
    return(
        <div className="flex items-center">
            <img src={img} alt="fiticon" />
            <p className="mx-2 text-white upper uppercase">{children}</p>
        </div> 
    )
}