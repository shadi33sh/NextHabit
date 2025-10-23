# Project API and Component Reference

This document provides a comprehensive reference for all public API routes, models, utilities, and React components in this repository, including usage examples.

## API Routes (Next.js App Router)

### Habit Collection API — `/api/habit`

- Method: POST
  - Description: Create a new habit document.
  - Request body (JSON):
    - `title` (string) — required
    - `habitType` (object) — required
      - `type` ('check' | 'number' | 'time')
      - `value` (number)
    - `days` (number[]) — optional; defaults to [1,2,3,4,5,6,7]
    - `color` ({ hex: string; name: string }) — required
  - Response: 201 Created with created Habit JSON.
  - Example:
    ```bash
    curl -X POST http://localhost:3000/api/habit \
      -H 'Content-Type: application/json' \
      -d '{
        "title": "Read",
        "habitType": { "type": "number", "value": 10 },
        "days": [2,4,6],
        "color": { "hex": "#3B82F6", "name": "Blue" }
      }'
    ```

- Method: GET
  - Description: List all habits.
  - Response: 200 OK with Habit[] JSON.
  - Example:
    ```bash
    curl http://localhost:3000/api/habit
    ```

- Method: PATCH
  - Description: Upsert today's progress for a habit by id (body-provided).
  - Request body (JSON):
    - `id` (string) — habit id
    - `progress` (number) — new progress value (1 for check, count for number, seconds/minutes for time depending on UI)
  - Behavior: If today's history entry exists, it's updated; else it's added.
  - Response: 200 OK with `{ success: true, habit }` or error.
  - Example:
    ```bash
    curl -X PATCH http://localhost:3000/api/habit \
      -H 'Content-Type: application/json' \
      -d '{ "id": "<habitId>", "progress": 1 }'
    ```

### Habit Item API — `/api/habit/:id`

- Method: GET
  - Description: Get a habit by id.
  - Response: 200 OK with Habit JSON.
  - Example:
    ```bash
    curl http://localhost:3000/api/habit/652c1c...
    ```

- Method: PATCH
  - Description: Upsert today's progress for a habit by id (path-provided).
  - Request body (JSON):
    - `progress` (number)
  - Response: 200 OK with updated Habit JSON.
  - Example:
    ```bash
    curl -X PATCH http://localhost:3000/api/habit/652c1c... \
      -H 'Content-Type: application/json' \
      -d '{ "progress": 15 }'
    ```

### Auth — `/api/auth/[...nextauth]`

- Methods: GET, POST (handled by NextAuth)
- Providers: Credentials, Google, GitHub
- Environment variables required:
  - `NEXTAUTH_SECRET`
  - `MONGODB_URI`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (optional if Google used)
  - `GITHUB_ID`, `GITHUB_SECRET` (optional if GitHub used)
- Notes:
  - Credentials provider checks `users` collection with fields `email`, `hashedPassword`, and `emailVerified`.

## Data Model

### Habit (`src/models/Habit.ts`)

- Interfaces
  - `IHistory`: { date: string; progress?: number }
  - `HabitType`: { type: 'check' | 'time' | 'number'; value: number }
  - `IHabit` extends Document:
    - `title: string`
    - `habitType: HabitType`
    - `history: IHistory[]` (default: [])
    - `days: number[]` (1..7; default: [1..7])
    - `color: { hex: string; name: string }`
    - timestamps `createdAt`, `updatedAt`

- Behavior
  - Export: default Mongoose model `Habit` with caching via `mongoose.models.Habit`.

## Utilities

### MongoDB (Mongoose) — `src/lib/dbConnect.ts`

- `dbConnect(): Promise<typeof mongoose>`
  - Cached connection using `global._mongooseCache`.
  - Requires `MONGODB_URI` environment variable.

### MongoDB (Native) — `src/lib/mongodb.ts`

- `clientPromise: Promise<MongoClient>`
  - Singleton client for NextAuth MongoDB adapter.

### Seeder — `src/lib/Seeder.ts`

- `seedHabits(): Promise<void>`
  - Connects to DB, inserts 10 randomized habit documents for testing.

## React Components

Note: Components under `src/app` generally use the Next.js App Router and many are Client Components (`'use client'`).

### Layout and Providers
- `RootLayout` (`src/app/layout.tsx`)
  - Wraps app with `SessionProvider`, `AlertProvider`, and a client-side dark-mode initializer.

- `Providers` (`src/app/Provider.tsx`)
  - Props: `{ children: ReactNode }`
  - Wraps children with NextAuth `SessionProvider`.

- `AlertProvider`, `useAlert` (`src/app/Alert.tsx`)
  - Context for transient alert messages.
  - `useAlert().showAlert(type, message, action?)`.

- `DarkModeToggle` (`src/app/toggleDarkMode.tsx`)
  - Initializes dark theme from `localStorage`.

- `ThemeWrapper` (`src/app/themeWraper.tsx`)
  - Props: `{ children: ReactNode }`
  - Container that syncs theme and applies background/text colors.

### UI Elements
- `SigninButton` (`src/app/components/SigninButton.tsx`)
  - Shows user avatar and sign-in/out controls using NextAuth.

- `SpacialText` (`src/app/components/SpacialText.tsx`)
  - Props: `{ children: ReactNode }`
  - Styled small text badge.

- `ProgressCicle` (`src/app/components/ProgressCicle.tsx`)
  - Props: `{ Percent: number }`
  - Circular progress indicator.

- `InfinityLoading` (`src/app/components/InfinityLoading.tsx`)
  - Animated infinity loader SVG.

### Habit UI
- `Calender` (`src/app/components/Calender.tsx`)
  - Props: `{ habits: IHabit[] }`
  - Monthly calendar grid with habit completion dots; opens `HabitDayModal`.

- `HabitDayModal` (`src/app/components/DayModal.tsx`)
  - Props: `{ isOpen: boolean; onClose: () => void; selectedDate: string; habits: IHabit[] }`
  - Shows day overview and uses `HabitsGrid` for that date.

- `HabitsGrid` (`src/app/page.tsx`)
  - Props: `{ habits, onHabitClick?, ISOToday, updateHabitProgress? }`
  - List of habits cards with progress and actions.

- `HabitCalendar` (`src/app/components/HabitCalandar.tsx`)
  - Props: `{ habit: IHabit; getProgressPercentage: (date: string, habit: IHabit) => number }`
  - Month view for a single habit’s history.

- `HabitModal` (`src/app/components/HabitModal2.tsx`)
  - Props: `{ id: string; onClose: () => void; updateState: (id: string, progress: number) => void }`
  - Detailed habit modal to update progress; includes per-type controls and history.

- `AddHabitForm` (`src/app/components/habitform.tsx`)
  - Props: `{ onCancel?: () => void }`
  - Modal form to create a habit; POSTs to `/api/habit`.

- `SideBar` (`src/app/sideBar.tsx`)
  - Fixed sidebar with theme toggle, add habit, and auth button.

### Pages
- Home/Tracker (`src/app/page.tsx`) — Enhanced habit tracker UI; exports helper functions:
  - `isHabitCompleted(habit, date)`
  - `calculateStreak(history)`
  - `getCompletionPercentage(habit, ISOToday)`
  - `getDayPercentage(habits, ISOToday)`

- Landing (`src/app/home/page.tsx`) — Marketing/landing layout.

## Usage Examples

### Using the Habit APIs from the client
```ts
import axios from 'axios'

// Create a habit
await axios.post('/api/habit', {
  title: 'Read',
  habitType: { type: 'number', value: 20 },
  days: [2,4,6],
  color: { hex: '#3B82F6', name: 'Blue' }
})

// Fetch habits
const { data: habits } = await axios.get('/api/habit')

// Update progress by id
await axios.patch(`/api/habit/${habits[0]._id}`, { progress: 1 })
```

### Rendering key components
```tsx
import Calender from '@/app/components/Calender'
import { IHabit } from '@/models/Habit'

export default function Dashboard({ habits }: { habits: IHabit[] }) {
  return <Calender habits={habits} />
}
```

### Alerts
```tsx
import { useAlert } from '@/app/Alert'

const { showAlert } = useAlert()
showAlert('success', 'Habit created successfully')
```

## Environment Variables
- `MONGODB_URI` — required for db and NextAuth adapter
- `NEXTAUTH_SECRET` — required for NextAuth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — for Google auth
- `GITHUB_ID`, `GITHUB_SECRET` — for GitHub auth

## Notes
- Days of week are numbers 1..7.
- Time-based habits use numeric progress compared to `habitType.value` (UI treats as minutes/seconds depending on context).
- API PATCH exists in both collection route and item route; prefer item route: `/api/habit/:id`.
