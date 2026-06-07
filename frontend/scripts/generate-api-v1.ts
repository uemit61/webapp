import fs from "fs";
import path from "path";
import { execSync } from "child_process";// wird im Terminal ausgeführt
import chalk from "chalk";

const schemaUrl = "http://localhost:8000/api/schema/"; // Immer aktuell vom Django-Server
const typeFile = path.resolve("src/app/lib/generated/types.ts"); // Wird generiert s.U
const apiFile = path.resolve("src/app/lib/generated/api.ts"); // Wird generiert s.U

// Über den Django-Server wird die types.ts immer aktuell erstellt
// execSync führt Terminal-Comando aus
execSync(`pnpm dlx openapi-typescript ${schemaUrl} --output ${typeFile}`, {
  stdio: "inherit",
});

// Wir lesen nun die generierte Datei types.ts ein,
// um die Schemanamen (Tabellennamen/Modelnamen,Entiätennamen...u.s.w  aus der DB) zu erhalten.
// s. app/lib/types.ts  ... schemas :{ User:{...},Registration:{...},...}
const text = fs.readFileSync(typeFile, "utf-8");



// Nur der Schema-Block wird betrachtet also schema: { ...}
const schemasMatch = text.match(/schemas:\s*{([\s\S]*?)}\s*;\s*\n\s*}/m);


// Falls types.ts nicht richtig generiert wurde, wird abgebrochen, weil es sonst s.U
// schemasBlock = null[1] zu Laufzeitfehlern führt.
if (!schemasMatch) {
    console.error("No schemas match");
  process.exit(1);
}

// Der in halt von Block also alles was in {...}  drin ist, s.0  User:{..},Registration:{...}
const schemasBlock =schemasMatch[1]+'}';

// Wir erstellen ein Array aus den Block und erhalten
// ~ [ [ 'user: { id: Number, ...  };', 'user' ], mit und können
// s.U   mit matches[*][1] die Namen der Tabellen lesen.
const matches = Array.from(schemasBlock.matchAll(/([A-Za-z0-9_]+):\s*{[\s\S]*?^\s*};?/gm));

// Namen als in einem Array Lists. let schemaNames (veränderlich), weil Liste
// außer die DB-Tabellen, auch weitere Typen hat.
let schemaNames = matches.map((m)=>m[1])


// Die weiteren Typen werden gefiltert
schemaNames = schemaNames.filter(
    (name) =>
        !name.startsWith("Patched") &&
        !name.endsWith("Enum") &&
        !name.endsWith("Error") &&
        !name.toLowerCase().includes("enum")
);

// Wir entfernen doppelte Einträge mit new Set(schemaNames)
// erhalten {'user','registration'...}, und mit [...Set(list)]
// wirds erneut zu einem Array.
schemaNames = [...new Set(schemaNames)].sort();


// Wir schreiben die Zeilen von api.ts (lines) das ~ folgende Beispiel:
// type UserList = components["schemas"]["User"]; user:
// list: () => useSWR<UserList[]>("/users/", fetcher),
// wird generalisiert für jede Tabelle aus der DB.
// Und für die einzelnen CRUD - list()   → GET /model/ (s.O)
// - detail() → GET /model/{id}/ - create() → POST /model/
// - update() → PUT /model/{id}/ - delete() → DELETE /model/{id}/
const lines = schemaNames.map((name)=> {


    const lower = name.toLowerCase();
    // Obwohl die Django-User-Tabelle "User" heißt ist die api/.../users/ (Ausnahme),
    // daher gesondert betrachtet, für den Rest reicht lowerCacse
    const endpoint = lower === "user" ? "/users/" : `/${lower}/`;

    // SWR CRUD Liste (list), einzelner Datensatz (detail),...
    return `  ${lower}: {
    list: () => useSWR<components["schemas"]["${name}"][]>("${endpoint}", fetcher),
    get: (id: string | number) =>
      useSWR<components["schemas"]["${name}"]>(\`${endpoint}\${id}/\`, fetcher),
    create: () => useSWRMutation<
      components["schemas"]["${name}"],
      Error,
      string,
      Partial<components["schemas"]["${name}"]> // Autocomplete
    >("${endpoint}", (url, { arg }) =>
      fetcher(url, { method: "POST", body: JSON.stringify(arg) })
    ),
    update: () => useSWRMutation<
      components["schemas"]["${name}"],
      Error,
      string,
      Partial<components["schemas"]["${name}"]>
    >("${endpoint}", (url, { arg }) =>
      fetcher(\`\${url}\${(arg as any).id}/\`, {
        method: "PUT",
        body: JSON.stringify(arg),
      })
    ),
    delete: () => useSWRMutation<
      void,
      Error,
      string,
      string | number
    >("${endpoint}", (url, { arg }) =>
      fetcher(\`\${url}\${arg}/\`, { method: "DELETE" })
    ),
  },`;
});

const output = `/**
 *  AUTO-GENERIERTE   BITTE NICHTS REINSCHREIBEN!
 *  Wurde automatisch generiert aus den Django-Server (${schemaUrl})
 */
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "@/app/lib/fetcher";
import type { components } from "@/app/lib/generated/types";

export const api = {
${lines.join("\n")}
};
`;

fs.writeFileSync(apiFile, output);

console.log('✨ '+chalk.white.bold('own-swr-crud-api 1.0.0'))
console.log('🚀 '+chalk.blue('C:/.../app/lib/types.ts')+
    chalk.green(' → C:Users/ÜmitYildirim/PycharmProjects/cardclub/frontend/src/app/lib/api.ts')+
    chalk.gray(' [irgendwas ms]'))