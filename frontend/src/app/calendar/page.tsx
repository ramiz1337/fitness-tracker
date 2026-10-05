"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";
import { apiRequest, getStoredUser } from "../lib/api";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
  loading: () => <p className="p-12 text-center text-stone-500">Loading calendar…</p>,
});

interface Workout {
  id: number;
  name: string;
  exercises: { exerciseId: number; exerciseName: string; sets: number; reps: number }[];
}

interface ScheduledWorkout {
  id: string;
  title: string;
  start: string;
  end: string;
  workoutId: number;
  completed: boolean;
}

function localDateTimeValue(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isScheduledWorkout(value: unknown): value is ScheduledWorkout {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ScheduledWorkout>;
  return typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.start === "string" &&
    typeof item.end === "string" &&
    typeof item.workoutId === "number" &&
    typeof item.completed === "boolean";
}

export default function CalendarPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [events, setEvents] = useState<ScheduledWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [storageKey, setStorageKey] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = getStoredUser();
      const key = `fitness-tracker-calendar-${user.id}`;
      setStorageKey(key);
      const storedEvents = localStorage.getItem(key);
      if (storedEvents) {
        try {
          const parsed: unknown = JSON.parse(storedEvents);
          if (!Array.isArray(parsed) || !parsed.every(isScheduledWorkout)) {
            throw new Error("Saved calendar data is invalid.");
          }
          setEvents(parsed);
        } catch (parseError) {
          throw new Error(parseError instanceof Error ? parseError.message : "Unable to read saved calendar events.");
        }
      } else {
        setEvents([]);
      }

      const [mine, used] = await Promise.all([
        apiRequest<Workout[]>("/workouts/mine", user.token),
        apiRequest<Workout[]>("/workouts/used", user.token),
      ]);
      const byId = new Map<number, Workout>();
      [...mine, ...used].forEach((workout) => byId.set(workout.id, workout));
      setWorkouts(Array.from(byId.values()));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load your calendar.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const persistEvents = (nextEvents: ScheduledWorkout[]) => {
    if (!storageKey) {
      setError("Your calendar is not ready yet. Please try again.");
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextEvents));
      setEvents(nextEvents);
      setError("");
    } catch {
      setError("Your workout was changed, but this browser could not save it locally.");
    }
  };

  const calendarEvents = useMemo<EventInput[]>(
    () => events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.completed ? "#15803d" : "#365c42",
      borderColor: event.completed ? "#15803d" : "#365c42",
      textColor: "#ffffff",
      extendedProps: { workoutId: event.workoutId, completed: event.completed },
    })),
    [events],
  );

  const openNewEvent = (startDate: Date) => {
    if (dateKey(startDate) < dateKey(new Date())) {
      setError("You can’t schedule a workout in the past.");
      return;
    }
    setActiveEventId(null);
    setSelectedWorkoutId(workouts[0] ? String(workouts[0].id) : "");
    setStartValue(localDateTimeValue(startDate));
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    setEndValue(localDateTimeValue(endDate));
    setModalError("");
    setIsEditorOpen(true);
  };

  const openExistingEvent = (click: EventClickArg) => {
    const event = events.find((item) => item.id === click.event.id);
    if (!event) return;
    setActiveEventId(event.id);
    setSelectedWorkoutId(String(event.workoutId));
    setStartValue(localDateTimeValue(new Date(event.start)));
    setEndValue(localDateTimeValue(new Date(event.end)));
    setModalError("");
    setIsEditorOpen(true);
  };

  const saveEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalError("");
    const workout = workouts.find((item) => item.id === Number(selectedWorkoutId));
    const start = new Date(startValue);
    const end = new Date(endValue);
    if (!workout) {
      setModalError("Choose a workout plan first.");
      return;
    }
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      setModalError("Choose a valid start and end time.");
      return;
    }
    if (dateKey(start) < dateKey(new Date())) {
      setModalError("You can’t schedule a workout in the past.");
      return;
    }
    const nextEvent: ScheduledWorkout = {
      id: activeEventId || crypto.randomUUID(),
      title: workout.name,
      start: start.toISOString(),
      end: end.toISOString(),
      workoutId: workout.id,
      completed: events.find((item) => item.id === activeEventId)?.completed ?? false,
    };
    const nextEvents = activeEventId
      ? events.map((item) => item.id === activeEventId ? nextEvent : item)
      : [...events, nextEvent];
    persistEvents(nextEvents);
    setIsEditorOpen(false);
  };

  const deleteEvent = () => {
    if (!activeEventId) return;
    persistEvents(events.filter((event) => event.id !== activeEventId));
    setIsEditorOpen(false);
  };

  const toggleCompleted = () => {
    if (!activeEventId) return;
    persistEvents(events.map((event) =>
      event.id === activeEventId ? { ...event, completed: !event.completed } : event,
    ));
    setIsEditorOpen(false);
  };

  const today = dateKey(new Date());

  return (
    <main className="mt-24 grow bg-[#f6f8f4] px-4 pb-16 pt-10 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="mb-7 flex flex-col justify-between gap-5 rounded-3xl bg-[#14251c] px-6 py-8 text-white shadow-xl sm:px-9 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-lime-300">Stay consistent</p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Training calendar</h1>
            <p className="mt-3 max-w-xl leading-7 text-green-50/75">Plan your upcoming sessions, keep your routine on track, and celebrate every workout you complete.</p>
          </div>
          <button
            type="button"
            disabled={workouts.length === 0 || isLoading}
            onClick={() => {
            const start = new Date();
            start.setHours(9, 0, 0, 0);
            openNewEvent(start);
            }}
            className="rounded-xl bg-lime-300 px-5 py-3 font-bold text-[#14251c] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Schedule a workout
          </button>
        </section>

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Planned</p>
            <p className="mt-1 text-xl font-extrabold">{events.filter((event) => !event.completed).length}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Completed</p>
            <p className="mt-1 text-xl font-extrabold text-green-800">{events.filter((event) => event.completed).length}</p>
          </div>
          <div className="flex min-w-[250px] flex-1 items-center rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-950">
            Your calendar is saved in this browser for your account. Calendar syncing across devices isn’t available because the backend has no calendar endpoints.
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
        {!isLoading && workouts.length === 0 && (
          <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            You don’t have any saved workout plans yet. Create or save a plan on the Workout Plans page before scheduling a session.
          </div>
        )}

        <section aria-label="Workout schedule" className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-6">
          {isLoading ? (
            <p className="p-12 text-center text-stone-500">Loading your workouts…</p>
          ) : (
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
              height="auto"
              expandRows
              allDaySlot={false}
              slotMinTime="05:00:00"
              slotMaxTime="24:00:00"
              slotDuration="01:00:00"
              nowIndicator
              selectable={workouts.length > 0}
              selectMirror
              select={(selection) => openNewEvent(selection.start)}
              selectAllow={(selection) => dateKey(selection.start) >= today}
              validRange={{ start: today }}
              events={calendarEvents}
              eventClick={openExistingEvent}
              eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
              dayHeaderFormat={{ weekday: "short", month: "short", day: "numeric" }}
              slotLabelFormat={{ hour: "numeric", minute: "2-digit", hour12: true }}
              eventClassNames="cursor-pointer rounded-lg border-0 px-1 py-0.5 font-semibold shadow-sm"
              eventContent={(content) => (
                <div className="overflow-hidden px-1 py-0.5">
                  <span className="block truncate text-xs font-bold sm:text-sm">
                    {content.event.extendedProps.completed ? "✓ " : ""}{content.event.title}
                  </span>
                </div>
              )}
            />
          )}
        </section>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsEditorOpen(false);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="calendar-editor-title" className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-800">{activeEventId ? "Update your schedule" : "Add to your schedule"}</p>
                <h2 id="calendar-editor-title" className="mt-1 text-2xl font-extrabold">{activeEventId ? "Workout details" : "Schedule a workout"}</h2>
              </div>
              <button onClick={() => setIsEditorOpen(false)} aria-label="Close scheduler" className="rounded-full p-2 text-2xl leading-none text-stone-400 hover:bg-stone-100">×</button>
            </div>
            <form onSubmit={saveEvent} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-stone-700">
                Workout plan
                <span className="relative mt-2 block">
                  <select
                    required
                    value={selectedWorkoutId}
                    onChange={(event) => setSelectedWorkoutId(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-stone-200 bg-gradient-to-b from-white to-green-50/60 px-4 py-3 pr-10 font-normal text-stone-800 shadow-sm outline-none transition hover:border-green-300 hover:shadow focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="" disabled>Select a saved workout</option>
                    {workouts.map((workout) => <option key={workout.id} value={workout.id}>{workout.name}</option>)}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-800">⌄</span>
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-stone-700">
                  Starts
                  <input required type="datetime-local" min={`${today}T00:00`} value={startValue} onChange={(event) => setStartValue(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-3 text-sm font-normal outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </label>
                <label className="block text-sm font-bold text-stone-700">
                  Ends
                  <input required type="datetime-local" min={startValue || `${today}T00:00`} value={endValue} onChange={(event) => setEndValue(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-3 text-sm font-normal outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </label>
              </div>
              {modalError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{modalError}</p>}
              <div className="flex flex-wrap justify-between gap-2 pt-2">
                <div className="flex flex-wrap gap-2">
                  {activeEventId && (
                    <>
                      <button type="button" onClick={toggleCompleted} className="rounded-xl border border-green-700 px-3 py-2.5 text-sm font-bold text-green-800 hover:bg-green-50">
                        {events.find((event) => event.id === activeEventId)?.completed ? "Mark planned" : "Mark done"}
                      </button>
                      <button type="button" onClick={deleteEvent} className="rounded-xl px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50">Delete</button>
                    </>
                  )}
                </div>
                <button className="rounded-xl bg-green-800 px-5 py-2.5 font-bold text-white hover:bg-green-900">
                  {activeEventId ? "Save changes" : "Add to calendar"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
