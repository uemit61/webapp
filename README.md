# Mitgliederverwaltung für Vereine (cardclub)

Fullstack-Webanwendung, mit der ein Verein Mitgliedsanträge online entgegennimmt, prüft und freigibt.
Das Backend ist eine REST-API mit Django REST Framework und PostgreSQL, das Frontend eine
Next.js-Anwendung in TypeScript. Entstanden ist das Projekt am Beispiel eines Kartenspielvereins,
daher der Arbeitstitel *cardclub*.

> **Stand November 2026: in Entwicklung.** Datenmodell, API und das datengetriebene Anmeldeformular
> stehen. Zugriffsschutz, das Absenden des Formulars und automatisierte Tests sind die nächsten
> Arbeitspakete, siehe [Stand und Arbeitspakete](#stand-und-arbeitspakete). Die Anwendung ist für
> die lokale Entwicklung gedacht, nicht für den öffentlichen Betrieb.

## Was die Anwendung macht

- Ein Antragsteller füllt ein mehrstufiges Formular aus: persönliche Daten,
  Mitgliedschaftsbedingungen, Hinweis zu Geldeinsätzen.
- Welche zusätzlichen Felder das Formular hat, legt ein Administrator in der Datenbank fest. Das
  Frontend baut die Eingabemaske und die Validierung daraus, ohne Änderung am Code.
- Jeder Antrag wird als Registrierung mit dem Status *ausstehend*, *genehmigt* oder *abgelehnt*
  gespeichert. Bei der Genehmigung legt das Backend den Benutzer und sein Profil an.
- Unterschriften werden vor dem Speichern verschlüsselt.

## Schwerpunkte

**Formular-Baukasten.** Das Modell `RegFormFieldDef` (`backend/app/models.py`) beschreibt jedes
Zusatzfeld: Typ, Beschriftung, Pflichtangabe, Breite, Zeile, Optionen und Fehlermeldung. Das Frontend
liest diese Definitionen über die API, rendert die passenden Eingabefelder
(`frontend/src/app/ui/form/RenderInput.tsx`) und erzeugt zur Laufzeit ein Zod-Schema für die
Validierung (`frontend/src/app/ux/utils/validationRegistrationForm.ts`).

**Typsicherheit über die Schnittstelle hinweg.** Das Backend veröffentlicht mit drf-spectacular ein
OpenAPI-Schema. Daraus erzeugt `openapi-typescript` die TypeScript-Typen des Frontends; ein eigenes
Skript (`frontend/scripts/generate-api-v1.ts`) baut darauf je Ressource SWR-Hooks für Liste,
Einzelabruf, Anlegen, Ändern und Löschen. Beides läuft automatisch vor jedem `pnpm dev` und
`pnpm build`, sodass Frontend und Backend nicht auseinanderlaufen.

**Freigabe als Service-Schicht.** Die Fachlogik der Genehmigung liegt in `backend/app/services.py`
und nicht in der View. Die API-Aktionen `approve` und `reject` (`backend/app/views.py`) prüfen den
Status und sind mit ihren Fehlerantworten im OpenAPI-Schema dokumentiert.

**Verschlüsselte Unterschriften.** Unterschriften kommen als Bilddaten an, werden mit Fernet
verschlüsselt (`backend/app/utils/crypto.py`) und als Binärdaten gespeichert. Die API liefert sie
nicht wieder aus.

**Filter, Suche und Sortierung ohne Wiederholung.** Eine Fabrikfunktion erzeugt für jedes Modell ein
passendes FilterSet (`backend/app/filters.py`), eine gemeinsame Basisklasse der ViewSets schaltet
Suche und Sortierung dazu (`backend/app/mixins.py`).

## Technik

| Bereich   | Eingesetzt                                                                              |
|-----------|-----------------------------------------------------------------------------------------|
| Backend   | Python 3.13, Django 5.2, Django REST Framework, SimpleJWT, drf-spectacular, django-filter |
| Datenbank | PostgreSQL (Treiber: psycopg 3)                                                          |
| Frontend  | Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 4                          |
| Formulare | React Hook Form, Zod                                                                     |
| Daten     | SWR, generierte Typen und Hooks aus dem OpenAPI-Schema                                   |
| Werkzeuge | pnpm, ESLint, openapi-typescript                                                         |

## Projektstruktur

```text
backend/                      Django-Projekt
  root/                       Einstellungen und URL-Wurzel
  app/
    models.py                 Registration, Profile, RegFormFieldDef
    serializer.py             Serializer; verschlüsselt Unterschriften beim Anlegen
    views.py                  ViewSets mit den Aktionen approve und reject
    services.py               Freigabe: legt Benutzer und Profil an
    filters.py                erzeugt je Modell ein FilterSet
    mixins.py                 Basisklasse für Filter, Suche und Sortierung
    signals.py                legt nach der Migration die Gruppen "users" und "admins" an
    utils/crypto.py           Ver- und Entschlüsselung mit Fernet
  schema.yaml                 exportierter Stand des OpenAPI-Schemas (aktuell ist immer /api/schema/)
frontend/                     Next.js-Anwendung
  scripts/generate-api-v1.ts  erzeugt Typen und SWR-Hooks aus dem OpenAPI-Schema
  src/app/
    registration/             Seite mit dem Anmeldeformular
    dashboard/                Verwaltungsbereich: Mitglieder, Registrierungen, Konfiguration
    lib/generated/            generierte Typen (types.ts) und Hooks (api.ts)
    ui/                       Bausteine: Navigation, Eingabefelder
    ux/                       Formularlogik: Schritte, Hooks, Validierung
mediafiles/                   hochgeladene Dateien zur Laufzeit (nicht im Repository)
```

## Lokal starten

Entwickelt unter Windows 11 mit Python 3.13, Node.js 22, pnpm 10 und PostgreSQL. Die Befehle gehen
vom Projektstamm aus.

### 1. Backend

```powershell
python -m venv .venv
.venv\Scripts\activate                 # Linux/macOS: source .venv/bin/activate
pip install -r backend/requirements.txt
copy backend\.env.example backend\.env # Linux/macOS: cp backend/.env.example backend/.env
```

In `backend/.env` die Werte eintragen. Die Befehle zum Erzeugen von `SECRET_KEY` und `FERNET_KEY`
stehen als Kommentar in der Datei. Anschließend in PostgreSQL die Datenbank anlegen, deren Name in
`POSTGRES_DB` steht:

```sql
CREATE DATABASE ccdb;
```

```powershell
cd backend
python manage.py migrate               # legt Tabellen und die Gruppen "users" und "admins" an
python manage.py createsuperuser
python manage.py runserver             # http://localhost:8000
```

### 2. Frontend

In einem zweiten Terminal, während das Backend läuft: Vor dem Start werden Typen und Hooks aus
`http://localhost:8000/api/schema/` erzeugt.

```powershell
cd frontend
pnpm install
pnpm dev                               # http://localhost:3000
```

Die Adresse der API lässt sich über `NEXT_PUBLIC_API_URL` in `frontend/.env.local` ändern; ohne
Angabe gilt `http://localhost:8000/api`.

### 3. Formularfelder anlegen

Im Django-Admin (`http://localhost:8000/admin/`) beim Modell *RegFormFieldDef* Felder anlegen: Typ,
`field_id`, Beschriftung, Zeile und Breite. Optionen für Auswahlfelder stehen zeilenweise als
`wert Beschriftung`, zum Beispiel `m Männlich`. Nach dem Neuladen von `/registration` erscheinen die
Felder im Formular.

### Adressen

| Adresse                               | Inhalt                               |
|---------------------------------------|--------------------------------------|
| `http://localhost:3000/registration`  | Anmeldeformular                      |
| `http://localhost:3000/dashboard`     | Verwaltungsbereich                   |
| `http://localhost:8000/api/docs/`     | Swagger-Oberfläche der API           |
| `http://localhost:8000/api/schema/`   | OpenAPI-Schema                       |
| `http://localhost:8000/admin/`        | Django-Admin                         |

## API im Überblick

| Endpunkt                              | Zweck                                                        |
|---------------------------------------|--------------------------------------------------------------|
| `/api/registration/`                  | Registrierungen; dazu `POST …/{id}/approve/` und `…/{id}/reject/` |
| `/api/regformfielddef/`               | Felddefinitionen des Formulars                               |
| `/api/users/`, `/api/profile/`        | Benutzer und Profile                                         |
| `/api/group/`, `/api/permission/`     | Gruppen und Berechtigungen                                   |
| `/api/token/`, `/api/token/refresh/`  | JWT ausstellen und erneuern                                  |

Alle Listen lassen sich filtern, durchsuchen und sortieren, zum Beispiel
`/api/registration/?status=pending&ordering=-created_at`.

## Stand und Arbeitspakete

Der Stand unten stammt aus einem vollständigen Code-Review vom 17. November 2026 mit Claude Code.
Die genannten Punkte wurden lokal nachgestellt; die Arbeitspakete fassen sie nach Priorität zusammen.

### Funktioniert

- Datenmodell mit 17 Migrationen, die zu den Modellen passen und auf einer leeren Datenbank
  durchlaufen.
- API mit OpenAPI-Schema und Swagger-Oberfläche, Filter, Suche und Sortierung.
- Genehmigung und Ablehnung über die API-Aktionen, einschließlich Statusprüfung und Anlegen von
  Benutzer und Profil.
- Anmeldeformular in drei Schritten: Die Felder aus der Datenbank werden gerendert und im Browser
  validiert.
- Generierte Typen und Hooks stimmen mit der aktuellen API überein.
- Die Unterschrift des Antragstellers wird im Backend verschlüsselt gespeichert.

### Bekannte Einschränkungen

- **Kein Zugriffsschutz.** Die API läuft im Entwicklungsmodus mit `AllowAny`. JWT-Endpunkte und
  Gruppen sind angelegt, werden aber noch nicht durchgesetzt; im Frontend gibt es noch keine
  Anmeldung.
- **Das Formular wird noch nicht abgeschickt.** Im Frontend fehlen die Anbindung an die API, die
  Adressfelder und das Unterschriftenfeld.
- **Freigabe mit Lücken.** Sie schlägt bei Anträgen mit Zusatzfeldern fehl, der Statuswechsel im
  Django-Admin funktioniert nicht, und freigegebene Benutzer erhalten noch kein Passwort.
- **Dashboard.** Es zeigt bisher nur Listen; die Formularfelder werden im Django-Admin gepflegt.
- **Keine automatisierten Tests.** Der Produktions-Build läuft noch nicht durch (Lint-Fehler,
  Platzhalterdateien).
- **Abhängigkeiten.** Die Python-Pakete sind noch nicht auf feste Versionen gesetzt; Django und
  Next.js liegen hinter dem aktuellen Patch-Stand ihrer Versionslinie.

### Arbeitspakete

| Nr. | Paket                  | Inhalt                                                                                                   |
|-----|------------------------|----------------------------------------------------------------------------------------------------------|
| 1   | Zugriffsschutz         | Berechtigungen je Endpunkt (öffentlich bleibt nur das Anlegen einer Registrierung), Rollen durchsetzen, Anmeldung im Frontend, sensible Felder aus Filter und Suche ausnehmen |
| 2   | Freigabe absichern     | Freigabe in einer Transaktion, Fehlerfälle als saubere Antworten, Statuswechsel im Admin, Passwortvergabe für neue Mitglieder; dazu Tests für Service und Serializer |
| 3   | Formular fertigstellen | Adressfelder, Unterschriftenfeld, Absenden an die API, Beschriftungen mit den Eingabefeldern verknüpfen     |
| 4   | Qualität und Build     | Lint-Fehler beheben, Platzhalterdateien entfernen, Abhängigkeiten aktualisieren und festschreiben, Einstellungen aus der Umgebung lesen |
| 5   | Dashboard              | Freigabe per Klick, eigene Oberfläche für den Formular-Baukasten                                           |

## Autor und Lizenz

Ümit Yildirim · uemit611@outlook.de

Copyright (c) 2025–2026 Ümit Yildirim. Alle Rechte vorbehalten. Der Quellcode darf zu Informations-
und Bewerbungszwecken gelesen werden. Jede weitere Nutzung, insbesondere das Kopieren, Verändern
oder Verbreiten, ist ohne vorherige schriftliche Zustimmung des Autors nicht gestattet.
