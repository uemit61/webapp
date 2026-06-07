import { useEffect, useState } from "react";


export function useResponsiveSidebar(breakpoint: number = 768) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= breakpoint) {
        setSidebarOpen(true);   // ab md aufwärts → offen
      } else {
        setSidebarOpen(false);  // darunter → geschlossen
      }
    };

    // direkt beim ersten Rendern prüfen
    handleResize();

    // Event-Listener für Resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return { sidebarOpen, setSidebarOpen };
}
