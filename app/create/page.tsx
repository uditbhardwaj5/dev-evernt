'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const tagsString = formData.get('tags') as string;
      const agendaString = formData.get('agenda') as string;
      
      formData.set('tags', JSON.stringify(tagsString.split(',').map(t => t.trim())));
      formData.set('agenda', JSON.stringify(agendaString.split(',').map(a => a.trim())));

      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/events');
      } else {
        const data = await res.json();
        alert(`Error: ${data.message || 'Failed to create event'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-10 w-full">
      <h1 className="text-center mb-10">Create Event</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full glass p-8">
        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Title</label>
          <input name="title" required type="text" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Description</label>
          <textarea name="description" required rows={4} className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white"></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Overview</label>
          <textarea name="overview" required maxLength={500} rows={2} className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white"></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Image</label>
          <input name="image" required type="file" accept="image/*" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-light-100 font-semibold">Venue</label>
              <input name="venue" required type="text" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-light-100 font-semibold">Location</label>
              <input name="location" required type="text" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-light-100 font-semibold">Date</label>
              <input name="date" required type="date" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white invert-[.8]" style={{colorScheme: 'dark'}} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-light-100 font-semibold">Time (HH:MM AM/PM)</label>
              <input name="time" required type="text" placeholder="10:00 AM" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-light-100 font-semibold">Mode</label>
              <select name="mode" required className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white border-r-8 border-transparent">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-light-100 font-semibold">Audience</label>
              <input name="audience" required type="text" placeholder="Developers, Designers..." className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
            </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Organizer</label>
          <input name="organizer" required type="text" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Agenda (comma separated)</label>
          <input name="agenda" required type="text" placeholder="Opening, Keynote, Lunch" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Tags (comma separated)</label>
          <input name="tags" required type="text" placeholder="React, Node.js, Web3" className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-white" />
        </div>

        <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 mt-4 cursor-pointer items-center justify-center rounded-[6px] px-4 py-3 text-lg font-semibold text-black disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </section>
  );
}
