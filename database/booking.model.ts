import { HydratedDocument, Model, Schema, Types, model, models } from "mongoose";

import { Event } from "./event.model";

export interface BookingDocumentShape {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingDocument = HydratedDocument<BookingDocumentShape>;
type BookingModel = Model<BookingDocumentShape>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocumentShape, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ eventId: 1 });

// Ensure every booking points to an existing event before insert/update.
bookingSchema.pre("save", async function (next) {
  const doc = this as BookingDocument;

  if (doc.isModified("email")) {
    doc.email = doc.email.trim().toLowerCase();
  }

  if (doc.isNew || doc.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: doc.eventId });
    if (!eventExists) {
      next(new Error("Referenced event does not exist"));
      return;
    }
  }

  next();
});

export const Booking = (models.Booking as BookingModel | undefined) ?? model<BookingDocumentShape, BookingModel>("Booking", bookingSchema);
