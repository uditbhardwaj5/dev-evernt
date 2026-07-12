import { NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import Event from '@/database/event.model';

type EventRouteParams = {
  slug?: string;
};

type EventRouteContext = {
  params: EventRouteParams | Promise<EventRouteParams>;
};

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET(
  _request: Request,
  context: EventRouteContext
) {
  try {
    const { slug } = await Promise.resolve(context.params);

    if (typeof slug !== 'string') {
      return NextResponse.json(
        { message: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      return NextResponse.json(
        { message: 'Slug cannot be empty' },
        { status: 400 }
      );
    }

    if (!isValidSlug(normalizedSlug)) {
      return NextResponse.json(
        { message: 'Invalid slug format' },
        { status: 400 }
      );
    }

    await connectDb();

    const event = await Event.findOne({ slug: normalizedSlug }).exec();

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { message: 'Failed to fetch event', error: message },
      { status: 500 }
    );
  }
}