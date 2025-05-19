# ☕ Airbean API – FJSX24 Backendutveckling Vecka 21

**Praktisk tillämpning av RESTful API-design, databashantering och säkerhet.**

## 📦 Projektbeskrivning

I detta grupparbete ska ni skapa ett API för en webbapp där det går att beställa kaffe och få den levererad via drönare (drönare ingår ej i uppgiften).

---

## 👥 Grupparbete – Instruktioner

1. En gruppmedlem skapar ett GitHub-repo och bjuder in övriga.
2. Skapa ett nytt **Project** på GitHub (eller i Trello).
3. Använd följande struktur:
   - User stories (kopiera från instruktionerna)
   - Tekniska tasks som stöd för backend-utvecklingen

📌 **Tips:** Vissa stories kan vara frontend-specifika – då krävs ingen backendkod.

👉 Exempelprojektstruktur:  
[GitHub Project-exempel](https://github.com/users/zocom-christoffer-wallenberg/projects/11/views/1)

---

## 🧩 Design

**Figma-skiss:**  
[Airbean v1.1 (med profil)](https://www.figma.com/file/ONcO3UQRPBLQsZc3FkysMt/AirBean-v.1.1---with-profile?node-id=0%3A1&t=aOiJ6vMVkTI7Xxth-0)

---

## ✅ Godkänt – Krav

- Fullständig funktionalitet enligt user stories.
- Backend byggd med **Express** och **PostgreSQL**.
- All input (URL/body) valideras via **middleware**.
- Endast produkter i menyn får beställas – validering av namn och pris i middleware.
- Användar-ID genereras automatiskt (t.ex. med `uuid`), används för orderhistorik.
- Användarnamn ska **inte** finnas i URL:er.

### 🔐 Säkerhet

- Lösenord hashas med **bcrypt** innan lagring.
- **Skydd mot SQL-injektioner** med parametriserade queries:

```js
// ❌ Fel (osäkert)
pool.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Rätt (säkert)
pool.query('SELECT * FROM users WHERE id = $1', [userId]);

