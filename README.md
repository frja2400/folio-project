# Frontend FOLIO

Frontend-applikation för FOLIO, en bokrecensionsplattform byggd med React, TypeScript och Vite. Applikationen kommunicerar med ReviewAPI och erbjuder sökning av böcker via Google Books API, bokrecensioner, favoriter samt JWT-autentisering med rollbaserad behörighet.

## Länk

Applikationen finns tillgänglig på följande URL:

## Installation

För att installera och köra lokalt:

* `git clone https://github.com/frja2400/folio-project.git`
* `cd folio-project`
* `npm install`
* Skapa en `.env`-fil i rotkatalogen och lägg till din Google Books API-nyckel:
```
  VITE_GOOGLE_BOOKS_API_KEY=din_nyckel_här
```
* Starta utvecklingsservern: `npm run dev`

## Sidor och funktioner

### Publika sidor

- **Startsida (`/`)** – Visar topprankade och senast recenserade böcker hämtade från ReviewAPI
- **Bokdetaljer (`/book/:id`)** – Visar bokdetaljer från Google Books API samt recensioner, recensionsformulär och snittbetyg
- **Sök (`/search`)** – Sök efter böcker på titel, författare eller ISBN via Google Books API
- **Logga in (`/login`)** – Formulär för autentisering
- **Registrera (`/register`)** – Skapa nytt konto

### Skyddade sidor

- **Profil (`/profile`)** – Visa och hantera egna recensioner och favoriter
- **Admin (`/admin`)** – Hantera alla recensioner och användare (radering av användare sker med en bekräftelsedialog)

## Autentisering

JWT-token lagras i `localStorage` och skickas automatiskt i `Authorization`-headern vid anrop till skyddade endpoints via en Axios-interceptor. Skyddad route `/profile` omdirigerar till `/login` om användaren inte är autentiserad, skyddad route `/admin` omdirigeras till `/` om användaren ej är admin. Navbar visar olika alternativ beroende på inloggningsstatus och roll.

## Projektstruktur
```
src/
├── components/     Återanvändbara komponenter (Navbar, BookCard, StarRating, ReviewForm, ReviewList, ProtectedRoute)
├── context/        AuthContext med useAuth-hook för global autentiseringshantering
├── pages/          Sidkomponenter (HomePage, SearchPage, BookDetailPage, LoginPage, RegisterPage, AdminPage, ProfilePage, NotFoundpage)
├── services/       API-tjänster för kommunikation med ReviewAPI och Google Books API
├── types/          TypeScript-interface för Book, Review, Favorite och User
├── App.tsx         Applikationens rotkomponent med routing
├── config.ts       API-konfiguration med bas-URL
├── index.css       Global CSS med anpassade Bootstrap-stilar
└── main.tsx        Applikationens startpunkt
```

## API-kommunikation

Applikationen kommunicerar med ReviewAPI via följande tjänster:

| Funktion | Metod | Ändpunkt | Beskrivning |
|---|---|---|---|
| `login()` | POST | `/api/auth/login` | Loggar in användare |
| `register()` | POST | `/api/auth/register` | Registrerar ny användare |
| `getReviews()` | GET | `/api/reviews/{bookId}` | Hämtar recensioner för en bok |
| `createReview()` | POST | `/api/reviews` | Skapar ny recension |
| `updateReview()` | PUT | `/api/reviews/{id}` | Uppdaterar recension |
| `deleteReview()` | DELETE | `/api/reviews/{id}` | Raderar recension |
| `getUserReviews()` | GET | `/api/reviews/user` | Hämtar inloggad användares alla recensioner |
| `getUserReviewForBook()` | GET | `/api/reviews/{bookId}/user` | Hämtar inloggad användares recension för en specifik bok |
| `getFavorites()` | GET | `/api/favorites` | Hämtar inloggad användares favoriter |
| `addFavorite()` | POST | `/api/favorites/{bookId}` | Lägger till bok i favoriter |
| `removeFavorite()` | DELETE | `/api/favorites/{bookId}` | Tar bort bok från favoriter |
| `getTopRated()` | GET | `/api/reviews/top-rated` | Hämtar 8 högst betygsatta böcker |
| `getLatest()` | GET | `/api/reviews/latest` | Hämtar 8 senast recenserade böcker |
| `getAllReviews()` | GET | `/api/admin/reviews` | Hämtar alla recensioner (admin) |
| `getAllUsers()` | GET | `/api/admin/users` | Hämtar alla användare (admin) |
| `deleteUser()` | DELETE | `/api/admin/users/{id}` | Raderar användare (admin) |
| `deleteReview()` | DELETE | `/api/admin/reviews/{id}` | Raderar valfri recension (admin) |

### Externt API

Applikationen använder Google Books API för att söka efter och hämta bokinformation. API-nyckeln lagras som en miljövariabel i `.env` och inkluderas inte i versionshanteringen. Sökresultat och bokinformation cachas i minnet under sessionen för att minimera antalet API-anrop.

### API-konfiguration

API-URL:en är definierad i `src/config.ts`:
```typescript
export const BASE_URL = 'http://localhost:5237/api'
```

## Validering

- **Recension:** Text är obligatorisk, betyg måste väljas (1–5)
- **Registrering:** Lösenord minst 8 tecken med minst en siffra, användarnamn och e-post är obligatoriska och måste vara unika

Valideringsfel visas direkt i formuläret och försvinner när användaren börjar skriva.

## Bygga för produktion
```bash
npm run build
```

Detta skapar en optimerad produktionsversion i `dist/`-mappen.

## Backend

Denna frontend är byggd för att fungera med ReviewAPI:
**https://github.com/frja2400/ReviewAPI**