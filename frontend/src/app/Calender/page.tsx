import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// import { createEventId } from './event-utils';
import './tooltip.css';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

interface WorkoutPlan {
  _id: string;
  name: string;
  trainingTime?: number;
  exercises: Exercise[];
  [key: string]: any;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

export default function Calendar() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [allWorkoutPlans, setAllWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [noWorkoutsMessage, setNoWorkoutsMessage] = useState(''); // <-- eklendi

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id;
    if (!userId) return;

    fetch(`http://localhost:8000/api/workoutP/list?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllWorkoutPlans(data);
          setNoWorkoutsMessage('');
        } else {
          setAllWorkoutPlans([]);
          setNoWorkoutsMessage('Keine Workouts gefunden. Bitte erstellen Sie zuerst einen Workout-Plan.');
        }
      })
      .catch((err) => {
        console.error(err);
        setAllWorkoutPlans([]);
        setNoWorkoutsMessage('Fehler beim Abrufen der Workouts. Bitte versuchen Sie es später erneut.');
      });
    // Takvim etkinliklerini yükle
  fetch(`http://localhost:8000/api/calendar?userId=${userId}`)
    .then(res => res.json())
    .then(eventsFromBackend => {
      
      const eventsForCalendar = eventsFromBackend.map((e: any) => ({
        id: e._id,
        title: e.workoutId?.name || "Workout",
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: false,
      }));
      setEvents(eventsForCalendar);
    });
  }, []);

  function renderEventContent(eventInfo: any) {
    return (
      <div
        className="text-xl font-bold text-center w-full cursor-pointer uppercase"
        onMouseEnter={(e) => handleTooltipOpen(e, eventInfo.event.title)}
        onMouseMove={(e) => handleTooltipMove(e)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {eventInfo.event.title}
      </div>
    );
  }

  function handleTooltipOpen(e: any, title: string) {
    const workout = allWorkoutPlans.find((w) => w.name === title);
    if (workout) {
      const content = `
        <div>
          <h1 style="font-weight:bold; margin-bottom: 4px;">${workout.name}</h1>
          ${workout.exercises
            .map(
              (ex) =>
                `<div style="margin-bottom:2px;">${ex.name} - ${ex.sets ?? "-"}x${ex.reps ?? "-"}</div>`
            )
            .join('')}
        </div>
      `;
      setTooltipContent(content);
      setShowTooltip(true);
    }
  }

  function handleTooltipMove(e: any) {
    setTooltipPosition({ x: e.pageX + 10, y: e.pageY + 10 });
  }

  function handleEvents(eventsList: any) {
    // FullCalendar'ın state güncellemesi gerekirse kullanılabilir
  }

  function handleDateSelect(selectInfo: any) {
    if (allWorkoutPlans.length === 0) {
      alert("Bitte erstellen Sie zuerst einen Workout-Plan.");
      return;
    }

    const selectedName = prompt(
      'Bitte wählen sie einen Workout aus \n' +
        allWorkoutPlans.map((w) => w.name).join('\n')
    );

    if (!selectedName) return alert('Keinen Workout-Plan ausgewählt');

    const selectedWorkout = allWorkoutPlans.find((w) => w.name === selectedName);
    if (!selectedWorkout) return alert('Workout ist nicht gefunden');

    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    // --------------- Send Backend -----------------
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    fetch('http://localhost:8000/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id || user.id,
        workoutId: selectedWorkout._id,
        start: startDate,
        end: endDate,
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Calender event ist gespeichert", data);
        setEvents(prev => [
          ...prev,
          {
            id: data._id,  
            title: selectedWorkout.name,
            start: startDate,
            end: endDate,
            allDay: false,
          }
        ]);
      })
      .catch(err => {
        console.error("Calendar event leider nicht geschpeichert", err);
      });
    
  }

  function handleEventClick(clickInfo: any) {
    if (window.confirm(`Möchten Sie dieses Ereignis wirklich löschen? '${clickInfo.event.title}'`)) {
      fetch(`http://localhost:8000/api/calendar/${clickInfo.event.id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Das Löschen aus der Datenbank ist fehlgeschlagen.');
          setEvents(prev => prev.filter(evt => evt.id !== clickInfo.event.id));
          clickInfo.event.remove();
        })
        .catch(err => {
          alert("Beim Löschen aus der Datenbank ist ein Fehler aufgetreten.!");
          console.error(err);
        });
    }
  }

  return (
    <main className="w-full grow mt-24 relative">
      {/* Workout-Plan-Namen unter der Überschrift anzeigen oder eine Nachricht anzeigen */}
      {noWorkoutsMessage ? (
        <div className="mb-4 p-4 bg-white rounded shadow text-center text-gray-500">
          {noWorkoutsMessage}
        </div>
      ) : allWorkoutPlans.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded shadow">
          <p className="font-semibold mb-2">
            Bitte wählen Sie den Namen des Workout-Plans, den Sie hinzufügen möchten:
          </p>
          <ul className="list-disc list-inside">
            {allWorkoutPlans.map((w) => (
              <li key={w._id}>{w.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className='h-[700px]'>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        headerToolbar={false}
        initialView="timeGridWeek"
        allDaySlot={false}
        slotDuration="01:00:00"
        height="100%"
        expandRows={true}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
        dayHeaderFormat={{ weekday: 'long' }}
        slotLabelClassNames="text-gray-400 text-lg"
        dayCellClassNames="bg-white border border-gray-200"
        select={handleDateSelect}
        editable={false}
        selectable={true}
        selectMirror={false}
        dayMaxEvents={true}
        weekends={weekendsVisible}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
        events={events}
        eventContent={renderEventContent}
        eventClassNames="bg-blue-500 bg-opacity-60 text-white border border-blue-400"
      />
      </div>

      {showTooltip && (
        <div
          className="tooltip"
          style={{
            position: 'absolute',
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          dangerouslySetInnerHTML={{ __html: tooltipContent }}
        />
      )}
    </main>
  );
}