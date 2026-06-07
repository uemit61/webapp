'use client'
import '@/app/ui/globals.css';
import TopNav from '@/app/ui/nav/topnav';
import SideNav from '@/app/ui/nav/sidenav';
import { geistSans, geistMono} from "@/app/ui/fonts";
import clsx from "clsx";
import  SideNavLinks  from '@/app/ui/dashboard/sidenav-links';
import TopNavLinks from "@/app/ui/dashboard/topnav-links";
import {useTouchSwipe} from "@/app/ux/hooks/useTouchSwipe";
import {useResponsiveSidebar} from "@/app/ux/hooks/useResponsivSideBar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // Status des SideBars wird auf false gesetzt
    const { sidebarOpen, setSidebarOpen } = useResponsiveSidebar(768)
    const { handleTouchStart, handleTouchEnd } = useTouchSwipe(
        () => setSidebarOpen(false), // nach links wischen
        () => setSidebarOpen(true)   // nach rechts wischen
    );

  return (
    <html lang="de">
      <body
            // Bsp. für fonts siehe  app/ui/fonts
            className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >

          <div className="flex flex-1 flex-row h-[100dvh] transition-all duration-200 ease-in-out will-change-transform"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
          >

                    <SideNav   isOpen={sidebarOpen} sideNavLinks={<SideNavLinks />} />


                <div className={clsx( 'flex justify-between flex-1 flex-col  min-h-[100dvh] transition-all duration-200 ease-in-out will-change-transform ',
                    {
                        'ml-[80%] md:ml-64 ' : sidebarOpen,
                    })
                }>

                    <TopNav onToggle={()=>setSidebarOpen((v)=>!v)} topNavLinks={<TopNavLinks />} />


                    <div className="p-6 overflow-y-auto bg-gray-200">
                        <main  className="min-h-[100dvh] p-4">
                            {children}
                        </main>
                    </div>
                </div>

          </div>
      </body>
    </html>
  )
}
