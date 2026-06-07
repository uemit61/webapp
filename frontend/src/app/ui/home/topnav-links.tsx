// Die Datei wird zu einem Clinet Component.
// Dies wird gemacht, wenn Browser-spezifische Features
// gebraucht werden. In diesem Fall usePathname() ist ein
// Client Hook aus next/navigation (s.U)
'use client'

import { Bars4Icon, ArrowRightIcon} from '@heroicons/react/24/outline';

// Client-seitige Navigation mit Prefetching:
// Statt eines kompletten Page Reloads lädt Next.js nur die benötigten Daten/Komponenten nach.
// Dadurch bleibt der Zustand erhalten und die Navigation ist deutlich schneller.
import Link from 'next/link';

// Client Hook auf Browser-Zustand angewiesen,
// daher funktionieren Sie nur mit Client Components (s.O)
import { usePathname } from 'next/navigation';

// clsx ermöglicht das dynamische Kombinieren von CSS-Klassen (inkl. Bedingungen).
// Nur Klassen deren Bedingungen zutreffen werden geladen (s.U).
import clsx from 'clsx';


// Json-Array links erstellen mit folgenden Keys
// {name:... href:... link.icon:...}
// Diese werden in der SideNav gerendert
const links =
    [
        {
            name: 'Einloggen',
            href: '/login',
            icon: ArrowRightIcon
        }

    ]
export default function TopNavLinks() {
   const pathname = usePathname();
    return (
        <div className='flex flex-row justify-end flex-1 '>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
            // <Link macht ein prefetch, d.h die html wird aktualisert
            // wobei mit <a die html komplett neu geladen wird
            <Link
                    key={link.name}
                    href={link.href}
                    className='flex  items-start flex-row justify-end gap-2 rounded-md bg-grey-300 p-1 text-black text-sm font-medium '
            >
                    <LinkIcon className="w-12 " />
                    <p className="text-lg p-2 ">{link.name}</p>
            </Link>
        );
      })}
    </div>
  );
}