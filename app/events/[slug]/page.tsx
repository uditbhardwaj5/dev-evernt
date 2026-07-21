import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();

function getBaseUrl(): string {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured");
  }

  return BASE_URL.replace(/\/$/, "");
}

function safeParseJsonStringArray(rawValue: unknown): string[] {
  if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

const EventDetailItem = ({icon, alt, label}: {icon: string; alt: string; label: string;}) => (
  <div className="felx-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({tags}: {tags: string[]}) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, index) => (
      <div className="pill" key={`${tag}-${index}`}>{tag}</div>
    ))}

  </div>
)

const EventDetailsPage = async ({params}:{params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  let eventData: Record<string, unknown> | null = null;

  try {
    const request = await fetch(`${getBaseUrl()}/api/events/${slug}`, { cache: "no-store" });

    if (request.status === 404) {
      return notFound();
    }

    if (!request.ok) {
      throw new Error(`Failed to fetch event details: ${request.status}`);
    }

    const payload = await request.json();
    eventData = payload?.event ?? null;
  } catch {
    return notFound();
  }

  if (!eventData || typeof eventData !== "object") {
    return notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = eventData;

  const descriptionText = typeof description === "string" ? description : "";
  const imageSrc = typeof image === "string" && image.length > 0 ? image : "/images/event-full.png";
  const overviewText = typeof overview === "string" ? overview : "";
  const dateText = typeof date === "string" ? date : "";
  const timeText = typeof time === "string" ? time : "";
  const locationText = typeof location === "string" ? location : "";
  const modeText = typeof mode === "string" ? mode : "";
  const audienceText = typeof audience === "string" ? audience : "";
  const organizerText = typeof organizer === "string" ? organizer : "";

  if (!descriptionText) return notFound();

  const bookings =10;

  const agendaItems = Array.isArray(agenda) && agenda.length > 0
    ? safeParseJsonStringArray(agenda[0])
    : [];
  const parsedTags = Array.isArray(tags) && tags.length > 0
    ? safeParseJsonStringArray(tags[0])
    : [];

  return (
    <section id="event">
     <div  className="header">
      <h1>Event Description</h1>
        <p>{descriptionText}</p>
      </div>
      <div className="details">
        {/* Left-side - event content */}
        <div className="content">
          <Image src={imageSrc} alt="Event Banner" width={800} height={800} className="banner" />
          
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overviewText}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={dateText} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={timeText} />
            <EventDetailItem icon="/icons/pin.svg" alt="location" label={locationText} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={modeText} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audienceText} />
          </section>
          <EventAgenda agendaItems={agendaItems} />
          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{organizerText}</p>
          </section>
          <EventTags tags={parsedTags} />
        </div>
        {/* Right-side - booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p>Join {bookings} people who have already booked their spots</p>
            ) : (
              <p>Be the first to book your spot!</p>
            )}
            <BookEvent />            
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsPage;
