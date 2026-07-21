import {NextRequest, NextResponse} from "next/server";
import {v2 as cloudinary} from "cloudinary";
import connectDb from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const formData = await req.formData();

        const event = Object.fromEntries(formData.entries());

        const file = formData.get('image');
        if (!(file instanceof File)) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, (error, result) => {
                if(error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create(event);

        return NextResponse.json({message: 'Event Created Successfully', event: createdEvent}, { status: 201 });


    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown Error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDb();
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({message: 'Events fetched successfully', events}, {status:200});
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({message: 'Failed to fetch events', error: message }, {status:500})
    }
}