import { HydratedDocument, Model, Schema, model, models } from "mongoose";

export interface EventDocumentShape {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventDocument = HydratedDocument<EventDocumentShape>;
type EventModel = Model<EventDocumentShape>;

const requiredString = (fieldName: string) => ({
  type: String,
  required: [true, `${fieldName} is required`],
  trim: true,
  validate: {
    validator: (value: string) => value.trim().length > 0,
    message: `${fieldName} cannot be empty`,
  },
});

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toIsoDateString = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date. Use a valid date value.");
  }
  return parsed.toISOString();
};

const to24HourTime = (value: string): string => {
  const input = value.trim().toLowerCase();

  const twentyFourHour = input.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHour) {
    return `${twentyFourHour[1].padStart(2, "0")}:${twentyFourHour[2]}`;
  }

  const twelveHourWithMinutes = input.match(/^([1-9]|1[0-2]):([0-5]\d)\s*(am|pm)$/);
  if (twelveHourWithMinutes) {
    const hourRaw = Number(twelveHourWithMinutes[1]);
    const minute = twelveHourWithMinutes[2];
    const period = twelveHourWithMinutes[3];
    const hour = period === "pm" ? (hourRaw % 12) + 12 : hourRaw % 12;
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  const twelveHourNoMinutes = input.match(/^([1-9]|1[0-2])\s*(am|pm)$/);
  if (twelveHourNoMinutes) {
    const hourRaw = Number(twelveHourNoMinutes[1]);
    const period = twelveHourNoMinutes[2];
    const hour = period === "pm" ? (hourRaw % 12) + 12 : hourRaw % 12;
    return `${String(hour).padStart(2, "0")}:00`;
  }

  throw new Error("Invalid time. Use HH:mm, h:mm am/pm, or h am/pm.");
};

const eventSchema = new Schema<EventDocumentShape, EventModel>(
  {
    title: requiredString("title"),
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: requiredString("description"),
    overview: requiredString("overview"),
    image: requiredString("image"),
    venue: requiredString("venue"),
    location: requiredString("location"),
    date: requiredString("date"),
    time: requiredString("time"),
    mode: requiredString("mode"),
    audience: requiredString("audience"),
    agenda: {
      type: [String],
      required: [true, "agenda is required"],
      validate: {
        validator: (items: string[]) =>
          Array.isArray(items) && items.length > 0 && items.every((item) => item.trim().length > 0),
        message: "agenda must contain at least one non-empty item",
      },
    },
    organizer: requiredString("organizer"),
    tags: {
      type: [String],
      required: [true, "tags are required"],
      validate: {
        validator: (items: string[]) =>
          Array.isArray(items) && items.length > 0 && items.every((item) => item.trim().length > 0),
        message: "tags must contain at least one non-empty item",
      },
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ slug: 1 }, { unique: true });

// Keep derived fields and normalized values consistent before persisting.
eventSchema.pre("save", function (next) {
  const doc = this as EventDocument;

  const requiredFields: Array<keyof Pick<EventDocumentShape, "title" | "description" | "overview" | "image" | "venue" | "location" | "date" | "time" | "mode" | "audience" | "organizer">> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredFields) {
    const value = doc[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      next(new Error(`${String(field)} is required`));
      return;
    }
  }

  if (!Array.isArray(doc.agenda) || doc.agenda.length === 0 || doc.agenda.some((item) => item.trim().length === 0)) {
    next(new Error("agenda must contain at least one non-empty item"));
    return;
  }

  if (!Array.isArray(doc.tags) || doc.tags.length === 0 || doc.tags.some((item) => item.trim().length === 0)) {
    next(new Error("tags must contain at least one non-empty item"));
    return;
  }

  // Only regenerate slug when the title changes to keep stable URLs.
  if (doc.isModified("title")) {
    doc.slug = slugify(doc.title);
  }

  // Normalize date/time into deterministic storage formats.
  doc.date = toIsoDateString(doc.date);
  doc.time = to24HourTime(doc.time);

  next();
});

export const Event = (models.Event as EventModel | undefined) ?? model<EventDocumentShape, EventModel>("Event", eventSchema);
