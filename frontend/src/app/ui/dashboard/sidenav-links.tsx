// Die Datei wird zu einem Clinet Component.
// Dies wird gemacht, wenn Browser-spezifische Features
// gebraucht werden. In diesem Fall usePathname() ist ein
// Client Hook aus next/navigation
'use client'

import { DocumentPlusIcon, CogIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Client-seitige Navigation mit Prefetching:
// Statt eines kompletten Page Reloads lädt Next.js nur die benötigten Daten/Komponenten nach.
// Dadurch bleibt der Zustand erhalten und die Navigation ist deutlich schneller.
import Link from 'next/link';

// Client Hook auf Browser-Zustand angewiesen,
// daher funktionieren Sie nur mit Client Components
import { usePathname } from 'next/navigation';

import clsx from 'clsx';


// Json-Array links erstellen mit folgenden Keys
// {name:... href:... link.icon:...}
// Diese werden in der SideNav gerendert
const links =
    [
        {
            name: 'Mitglieder',
            href: '/dashboard/users',
            icon: UserGroupIcon
        },

        {
            name: 'Registrationen',
            href: '/dashboard/registrations',
            icon: DocumentPlusIcon
        },

        {
            name: 'Konfigurationen',
            href: '/dashboard/customize_formular',
            icon: CogIcon
        }
    ]
export default function SidenavLinks() {
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
  'flex h-10 ml-3 mb-3 items-center justify-content-between rounded-md p-3 text-gray-300 text-lg font-bold ',
  {
    'bg-blue-400 ': pathname === link.href,
  },
)}
          >
            <LinkIcon className="w-6" />
            <p className="ml-3">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}