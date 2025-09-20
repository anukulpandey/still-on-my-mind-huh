# Still on my mind! Huh?

A simple PWA for your boo to let them know you think about them, with lots of data visualisation tools so that you always have a way to prove your innocense, cause all it takes is a single click on your phone.

What data visualisation tools huh? am I lying?
Probably not...

<img width="676" height="381.5" alt="Screenshot 2025-09-20 at 11 36 26 PM" src="https://github.com/user-attachments/assets/eb6288cb-33a7-454c-a664-b89f90ce9560" />

Oh.
Bargraphs too?

<img width="676" height="381.5" alt="Screenshot 2025-09-20 at 11 36 42 PM" src="https://github.com/user-attachments/assets/c6f3e227-0bbe-4d15-99f9-0947a42a3247" />

Radars as well?

<img width="676" height="381.5" alt="Screenshot 2025-09-20 at 11 36 58 PM" src="https://github.com/user-attachments/assets/aa7ed900-45d7-48c5-b52c-83f0d8417c4c" />

Gauge too uwu

<img width="676" height="381.5" alt="Screenshot 2025-09-20 at 11 37 12 PM" src="https://github.com/user-attachments/assets/899ff108-8fbe-44b3-8efd-2ba0f0bdcda0" />

Just click on the Button and Boo will be notified.

# Make one for you?

1. Clone the repo

```
git clone https://github.com/anukulpandey/still-on-my-mind-huh
cd still-on-my-mind-huh
```

2. Add .env variables

Create account on Supabase and run the following commands

```
-- enable pgcrypto for uuid
create extension if not exists pgcrypto;

create table if not exists misses (
  id uuid primary key default gen_random_uuid(),
  code text not null,     -- 143 or 1432
  name text not null,     -- name entered by the user
  time timestamptz not null default now()
);
```

```
VITE_SUPABASE_URL=https://YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_FOOTER_TEXT=YOUR_NAME
VITE_CHART_TITLE=YOUR_CHART_TITLE
```

3. Build and Deploy

```
yarn build
```

This will generate a `dist` folder , host it and enjoy

Default credentials 

Code `143` for Female

Code `1432` for Male
   
