// Die Datei wird zu einem Clinet Component.
// Dies wird gemacht, wenn Browser-spezifische Features
// gebraucht werden. In diesem Fall usePathname() ist ein
// Client Hook aus next/navigation (s.U)
'use client'

import { HomeModernIcon,UserPlusIcon} from '@heroicons/react/24/outline';

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
import {blue} from "next/dist/lib/picocolors";


// Json-Array links erstellen mit folgenden Keys
// {name:... href:... link.icon:...}
// Diese werden in der SideNav gerendert
const links =
    [
        {
            name: 'Home',
            href: '/',
            icon: HomeModernIcon,
        },
        {
            name: 'Anmeldeformular',
            href: '/registration',
            icon: UserPlusIcon,
        },
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: UserPlusIcon,
        }

    ];
export default function SideNavLinks() {
   const pathname = usePathname();
    return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
             className={clsx(
  'flex h-10 mb-3 items-center justify-content-between rounded-md p-3 text-gray-300 text-lg font-bold ',
  {
    'bg-blue-400 ': pathname === link.href,
  },
)}
          >
            <LinkIcon className="w-6" />
            <p className={'ml-3 '}>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}