"use client"

import { useState } from "react"

type CardProps = {
    img: string,
    overlayText: string,
    overlayDescrition: string
}

console.log("lakdsglakdglk")

export default function PersonalCard({ img, overlayText, overlayDescrition }: CardProps) {
    const [show, setShow] = useState(false);

    return (
        <div onMouseEnter={() => setShow(true)}  
            onMouseLeave={() => setShow(false)}
            className="flex flex-col w-1/4 relative cursor-pointer">
            <div className="border border-gray-300 flex justify-center p-4">
                <img src={img} alt={img} />
            </div>
            <div className={`absolute overflow-hidden 
                bg-white border border-gray-300 p-4 transition-all 
                ease-in-out w-full flex flex-col justify-center items-center left-0 top-0 
                ${show ? 'opacity-100 h-full' : 'opacity-0 h-0'}`}>
                <h1 className="font-semibold">{overlayText}</h1>
                <a className="max-w-full truncate text-red-800" href="#">{overlayDescrition}</a>
            </div>
        </div>
    )
}