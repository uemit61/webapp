'use client'

import { api } from '@/app/lib/generated/api';

export default function TestPage() {
  const { data, error, isLoading } = api.user.list();

  if (isLoading) return <p>Lade User…</p>;
  if (error) return <p>❌ Fehler: {error.message}</p>;

  return (
    <ul className="p-4">
      {data?.map((u) => (
        <li key={u.id}>
          {u.username} – {u.email}
        </li>
      ))}
    </ul>
  );
}