import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import Event from "@/database/event.model";
import connectDb from "@/lib/mongodb";
import { cacheLife } from "next/cache";

const Page = async () => {
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
      <h1 className="text-center">Know the Developer Events near YOU!!</h1>
      <p className="text-center mt-5">
        Hackathons, Meetups and Conferences ALL in one PLace.
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.length > 0  && events.map((event:IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
