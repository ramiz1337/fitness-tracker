# Fitness Tracker

Das ist unser Schulprojekt für einen Fitness Tracker. Mit der Anwendung kann
man sich registrieren und anmelden, Übungen anschauen und eigene
Workout-Pläne erstellen. Öffentliche Workouts können auch von anderen Nutzern
verwendet, kommentiert und bewertet werden.

## Verwendete Technologien

- Frontend: Next.js, React, TypeScript und Tailwind CSS
- Backend: ASP.NET Core / .NET 10
- Datenbank: SQLite mit Entity Framework Core
- Anmeldung: JWT

## Projekt starten

Benötigt werden:

- .NET 10 SDK
- Node.js ab Version 20.9
- npm

Backend und Frontend müssen gleichzeitig in zwei Terminals laufen.

### Backend

Im ersten Terminal:

```bash
cd Backend
dotnet restore
dotnet run --launch-profile http
```

Das Backend läuft danach auf <http://localhost:5102>.

Swagger kann unter <http://localhost:5102/swagger> geöffnet werden. Dort können
die API-Endpunkte getestet werden.

Beim ersten Start wird automatisch die Datei `fitness_tracker.db` im
Backend-Ordner erstellt. Die Übungen und Muskelgruppen werden ebenfalls
automatisch eingefügt.

### Frontend

Im zweiten Terminal:

```bash
cd frontend
npm ci
npm run dev
```

Danach kann die Seite unter <http://localhost:3000> geöffnet werden.

Zuerst muss über die Register-Seite ein Benutzer erstellt werden. Danach kann
man sich mit diesem Benutzer anmelden. Es gibt kein vorgegebenes Testkonto.

## Wichtige Ordner

```text
Backend/
  Controllers/     API-Endpunkte
  Data/            Datenbank und Seed-Daten
  DTOs/            Daten für Requests und Responses
  Models/          Datenbankmodelle
  Services/        Erstellung der JWT-Tokens

frontend/
  public/          Bilder
  src/app/         Seiten und Komponenten

Documentation/
  Uml.png          UML-Klassendiagramm
```

## Aufbau

Das Frontend schickt HTTP-Anfragen an das Backend. Das Backend verarbeitet die
Anfragen und speichert die Daten mit Entity Framework Core in einer lokalen
SQLite-Datenbank. Für geschützte Funktionen wird nach dem Login ein JWT
verwendet.

Das Klassendiagramm vom Backend befindet sich hier:
[Documentation/Uml.png](Documentation/Uml.png)

## Hinweise

- Das Frontend muss auf Port `3000` laufen, da dieser Port im Backend für CORS
  freigegeben ist.
- Das Backend muss auf Port `5102` laufen, weil das Frontend diese Adresse für
  die API verwendet.
- Die SQLite-Datenbank wird nicht in Git gespeichert, sondern beim ersten Start
  lokal erstellt.
