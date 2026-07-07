# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvents project. The setup includes:

- **Client-side initialization** via `instrumentation-client.ts` using the EU region reverse proxy, error tracking (`capture_exceptions: true`), and debug mode in development.
- **Reverse proxy** configured in `next.config.ts` routing `/ingest/*` through Next.js rewrites to `eu.i.posthog.com` (avoids ad blockers).
- **Event capture** in three components: `EventCard.tsx` (already instrumented), `ExploreBtn.tsx` (already instrumented), and `Navbar.tsx` (newly added).
- **Environment variables** written to `.env.local` (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`).
- **`posthog-node`** installed for future server-side tracking when API routes are added.
- **`Navbar.tsx`** — Added `'use client'` directive and `posthog.capture()` calls on the Events and Create Event nav links.

| Event name | Description | File |
|---|---|---|
| `event_card_clicked` | User clicks an event card on the home page to view event details. | `components/EventCard.tsx` |
| `explore_button_clicked` | User clicks the Explore Events button on the home page hero section. | `components/ExploreBtn.tsx` |
| `nav_events_clicked` | User clicks the Events link in the navigation bar. | `components/Navbar.tsx` |
| `nav_create_event_clicked` | User clicks the Create Event link in the navigation bar, signalling intent to list an event. | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/217576/dashboard/798358)
- [Explore button clicks](https://eu.posthog.com/project/217576/insights/ZAH8Qmm2)
- [Event card clicks (broken down by event)](https://eu.posthog.com/project/217576/insights/wuV44MPq)
- [Navigation engagement](https://eu.posthog.com/project/217576/insights/CgC5Fi92)
- [Event discovery funnel](https://eu.posthog.com/project/217576/insights/qDzO9cuO)
- [Create event intent](https://eu.posthog.com/project/217576/insights/MQb4c7MJ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` (or any bootstrap scripts) so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
