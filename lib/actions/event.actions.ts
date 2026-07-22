'use server';

import Event from '@/database/event.model';
import connectDb from '@/lib/mongodb';

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDb();
        const event = await Event.findOne({ slug });

        const events = await Event.find({ _id: { $ne: event._id }, tags: { $in: event?.tags } } ).limit(3).lean();
        return JSON.parse(JSON.stringify(events));
    }catch{
        return [];
    }
}