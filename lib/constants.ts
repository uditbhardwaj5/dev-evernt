export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "KubeCon + CloudNativeCon North America 2026",
    slug: "kubecon-cloudnativecon-na-2026",
    location: "Atlanta, GA",
    date: "November 10-13, 2026",
    time: "9:00 AM - 5:30 PM",
  },
  {
    image: "/images/event2.png",
    title: "AWS re:Invent 2026",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, NV",
    date: "December 1-5, 2026",
    time: "8:30 AM - 6:00 PM",
  },
  {
    image: "/images/event3.png",
    title: "React Summit Amsterdam 2026",
    slug: "react-summit-amsterdam-2026",
    location: "Amsterdam, Netherlands",
    date: "June 12-13, 2026",
    time: "10:00 AM - 6:00 PM",
  },
  {
    image: "/images/event4.png",
    title: "DevOpsDays New York 2026",
    slug: "devopsdays-new-york-2026",
    location: "New York, NY",
    date: "September 24-25, 2026",
    time: "9:30 AM - 5:00 PM",
  },
  {
    image: "/images/event5.png",
    title: "Google I/O Extended San Francisco Meetup",
    slug: "google-io-extended-san-francisco-meetup",
    location: "San Francisco, CA",
    date: "July 18, 2026",
    time: "6:00 PM - 9:00 PM",
  },
  {
    image: "/images/event6.png",
    title: "HackMIT 2026",
    slug: "hackmit-2026",
    location: "Cambridge, MA",
    date: "September 19-20, 2026",
    time: "All day",
  },
];