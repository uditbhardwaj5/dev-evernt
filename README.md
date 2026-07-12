# Dev-Event

Dev-Event is a Next.js app for discovering developer-focused events like hackathons, meetups, conferences, and community gatherings. It uses MongoDB for event data, Cloudinary for event images, and PostHog for product analytics.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- Cloudinary for image uploads
- PostHog for analytics
- Tailwind CSS v4

## Features

- Featured events feed on the home page
- Event detail pages by slug
- MongoDB-backed event API
- Image uploads stored in Cloudinary
- Analytics events for navigation, event cards, and the explore button
- Custom animated visual styling with a light-ray background

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A MongoDB database
- A Cloudinary account
- A PostHog project token

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with the following values:

```bash
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your_posthog_project_token
```

If you are uploading images through the event creation API, make sure your Cloudinary credentials are configured in the environment as well.

### Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## Routes

- `/` - home page with featured events
- `/events/[slug]` - event details page
- `/api/events` - list events or create a new event
- `/api/events/[slug]` - fetch a single event by slug

## Project Structure

- `app/` - App Router pages, layouts, and API routes
- `components/` - shared UI components
- `database/` - Mongoose models
- `lib/` - database and utility helpers
- `public/` - static assets such as icons and event images

## Notes

- The app fetches data from `NEXT_PUBLIC_BASE_URL` on the server side, so that value should point to your running deployment or local dev server.
- PostHog is initialized in the client instrumentation layer and the navigation and event cards emit capture events.