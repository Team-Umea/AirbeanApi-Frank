FJSX24-Backendutveckling-Vecka21
Praktisk tillämpning av RESTful API-design, databashantering och säkerhet.

Grupparbete Airbean API
Instruktioner
I detta grupparbete ska ni skapa ett API för en webbapp där det går att beställa kaffe och få den levererad via drönare (drönare ingår ej i uppgiften).

User stories
En gruppmedlem gör ett repo och bjuder in resterande gruppmedlemmar till det repot. Sedan under fliken Projects så välj ett nytt projekt och sätt upp enligt strukturen nedan samt kopiera över alla user stories. Ni får även använda Trello och skapa upp fler stories eller tasks (som kan vara mer tekniska). I detta grupparbete kan det vara till fördel att skapa upp lite fler tasks att koppla till en user story som mer beskriver det som behövs göras i backend för att uppnå funktionaliteten i user storyn.

Obs! En user story kan också enbart vara en FE-story alltså att det inte behövs göras något i backend.

Se detta som tips/hjälp, inga krav alls hittar ni här: https://github.com/users/zocom-christoffer-wallenberg/projects/11/views/1

Figmaskiss
https://www.figma.com/file/ONcO3UQRPBLQsZc3FkysMt/AirBean-v.1.1---with-profile?node-id=0%3A1&t=aOiJ6vMVkTI7Xxth-0
Betygskriterier
För Godkänt:

Uppfyller alla krav av funktionalitet.
Använder sig av Express och PostgreSQL som databas.
All input som skickas i url eller i body ska valideras i en middleware och ifall det är fel data ska ett felmeddelande skickas tillbaka.
Det ska enbart gå att lägga till produkter som finns i menyn, ifall någon annan produkt skickas med så ska ett felmeddelande skickas tillbaka. Även pris ska kontrolleras, allt detta ska göras i en middleware.
När ett konto skapas ska detta kopplas till ett slumpat användarid (här används fördelaktigt ett bibliotek) där användarid:et sedan kan användas för att hämta orderhistorik, användarnamn ska alltså ej skickas med i url för att hämta orderhistorik.
🔐 Säkerhet – SQL-injektioner och lösenord När ni bygger ert API är det viktigt att tänka på säkerhet. Här är två saker ni måste göra:
Lösenord ska hash:as med bcrypt innan de sparas i databasen.
Skydda databasen från attacker (SQL-injektioner)
Alla databasfrågor ska göras med parametriserade queries, inte genom att stoppa in användardata direkt i SQL-strängen.
❌ Fel sätt (kan vara farligt): pool.query(SELECT * FROM users WHERE id = ${userId})
✅ Rätt sätt (säkert):pool.query('SELECT * FROM users WHERE id = $1', [userId])
Detta kallas för parametriserade queries och det skyddar er databas från SQL-injektion, en typ av attack där en användare försöker skriva in farlig kod i t.ex. ett formulärfält.

För Väl Godkänt:

Allt i godkänt
Kunna se pågående beställningar och tidigare beställningar (man kollar när beställningen lades (klockslag) gentemot vad klockan är nu. Här är det godkänt att använda något bibliotek för datum och tidshantering (ex. moment.js eller date-fns).
Projektet ska använda en enkel MVC-struktur, med separata mappar för routes, controllers och databasmodellering.
Använd Swagger för att dokumentera ert API.
Ni har ett ER-diagram (valfritt val).
Inlämning
Inlämning sker på Canvas med en länk till ert Github repo med er kod senast fredag 23/5 23:59.

Redovisning
Fredagens lektion 08.30-11.30.
