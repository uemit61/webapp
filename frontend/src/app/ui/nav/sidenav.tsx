
'use client'
import Link from 'next/link';
import Image from "next/image";
import clsx from "clsx";



export default function SideNav ({ isOpen,sideNavLinks} : { isOpen: boolean ; sideNavLinks : React.ReactNode}){

  return (

    <aside className={clsx(
        " bg-[#020183]  text-white min-h-[100dvh] overflow-y-auto transition-all  ease-in-out will-change-transform ",
        {
          "w-[80%] md:w-64  fixed top-0 left-0  p-4  z-50 ": isOpen,   // Sidebar offen → volle Breite
          "w-0 p-0 ": !isOpen,   // Sidebar geschlossen → nimmt keinen Platz ein
        }
      )}>
      <Link
        className="flex mb-4 justify-center p-2  items-end "
        href="/"
      >
            <Image
                src="/tsLogo.jpg"
                width={200}
                height={150}
                className="mb-3 "
                alt="Screenshot of the dashboard project showing mobile version"
      />
      </Link>
        <div className="flex flex-col gap-2">
            {sideNavLinks}
        </div>

    </aside>

  );
}