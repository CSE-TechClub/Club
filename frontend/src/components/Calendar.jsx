import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMediaQuery } from "react-responsive";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine if we're in development or production
        const isDevelopment = process.env.NODE_ENV === "development";
        const apiUrl = isDevelopment
          ? "http://localhost:3001/api/calendar/events"
          : "/.netlify/functions/getCalendarEvents";

        console.log("Fetching events from:", apiUrl);

        const response = await fetch(apiUrl);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched events:", data);

        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
          description: event.description,
          location: event.location,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "#4a90e2",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Error loading calendar: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="calendar-container p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: isMobile ? "400px" : "600px" }}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          defaultView={isMobile ? "month" : "week"}
          popup
          selectable
          onSelectEvent={(event) => {
            alert(
              `${event.title}\n\n${
                event.description || "No description available"
              }\n\nLocation: ${event.location || "No location specified"}`
            );
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
