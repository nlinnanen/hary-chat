# Harychat

A web app for chatting anonymous and end to end encrypted chat for harrasment contact persons. Currently in production with the guild of industrial engineering and management Prodeko at [https://harychat.prodeko.org](harychat.prodeko.org) (note that the messages go to the real harrasment contact persons so don't send them for testing purposes).

## Startup

### Database

1. Run `docker-compose up -d`

### Backend

1. Copy `.env.example` and name it `.env.local` and add corresponding secrets (db creds)
1. `cd backend && npm i && npm run develop`

### Frontend

1. `cd frontend && npm i && npm run dev`
