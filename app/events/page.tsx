import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import Event from "@/database/event.model";
import connectDb from "@/lib/mongodb";
import { cacheLife } from "next/cache";
import TrackEvent from "@/components/TrackEvent";

const EventsPage = async () => {
    'use cache';
    cacheLife('hours');
    let events: IEvent[] = [];

    try {
      await connectDb();
      const eventsData = await Event.find().sort({createdAt: -1}).lean();
      if (eventsData) {
        events = JSON.parse(JSON.stringify(eventsData));
      }
    } catch (error) {
      console.error("Failed to load events", error);
    }

  return (
    <section>
      <TrackEvent eventName="events_page_viewed" />
      <h1 className="text-center">All Events</h1>
      <p className="text-center mt-5 text-light-100">
        Browse and discover developer events happening around you.
      </p>
      <div className="mt-20 space-y-7">
        <ul className="events">
          {events.length > 0 ? (
            events.map((event:IEvent) => (
              <li key={event.slug} className="list-none">
                <EventCard 
                  image={event.image}
                  title={event.title}
                  slug={event.slug}
                  location={event.location}
                  date={event.date}
                  time={event.time}
                />
              </li>
            ))
          ) : (
            <p className="text-center col-span-full">No events found.</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default EventsPage;
