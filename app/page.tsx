import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";



const Page = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.trim();
    let events: IEvent[] = [];

    if (BASE_URL) {
      try {
        const response = await fetch(`${BASE_URL.replace(/\/$/, "")}/api/events`, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const payload = await response.json();
        if (Array.isArray(payload?.events)) {
          events = payload.events;
        }
      } catch (error) {
        console.error("Failed to load events", error);
      }
    } else {
      console.error("NEXT_PUBLIC_BASE_URL is not configured");
    }

  return (
    <section>
      <h1 className="text-center">Know the Developer Events near YOU!!</h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and Conferences ALL in one PLace.
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.length > 0  && events.map((event:IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
