'use client'
import TopNavLinks  from "@/app/ui/home/topnav-links";
import {Menu} from "lucide-react";
import { useState } from 'react'

type TopNavProps = {
    onToggle: () =>void;
    topNavLinks: React.ReactNode;

};

interface SideNavProps {

}
export default function TopNav({ onToggle,topNavLinks } :   TopNavProps  )
{

     return (
        <nav className="flex flex-1 flex-row   items-start bg-white ">
            {/* SideNav Toggle*/}
            <button
                onClick={onToggle}
                aria-label="Toggle sidebar"
                className="p-1  justify-start text-black cursor-pointer "
            >
                <Menu size={48}  />
            </button>

                {topNavLinks}


        </nav>
     )
}