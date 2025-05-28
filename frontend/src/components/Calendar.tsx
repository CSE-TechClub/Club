import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval as eachDay,
  isSameMonth,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  colorId?: string;
}

// Google Calendar-like color themes
const EVENT_COLORS = [
  {
    id: "1",
    light: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-700",
    hover: "hover:bg-blue-100",
  },
  {
    id: "2",
    light: "bg-green-50",
    border: "border-green-500",
    text: "text-green-700",
    hover: "hover:bg-green-100",
  },
  {
    id: "3",
    light: "bg-purple-50",
    border: "border-purple-500",
    text: "text-purple-700",
    hover: "hover:bg-purple-100",
  },
  {
    id: "4",
    light: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
    hover: "hover:bg-red-100",
  },
  {
    id: "5",
    light: "bg-yellow-50",
    border: "border-yellow-500",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-100",
  },
  {
    id: "6",
    light: "bg-pink-50",
    border: "border-pink-500",
    text: "text-pink-700",
    hover: "hover:bg-pink-100",
  },
  {
    id: "7",
    light: "bg-indigo-50",
    border: "border-indigo-500",
    text: "text-indigo-700",
    hover: "hover:bg-indigo-100",
  },
  {
    id: "8",
    light: "bg-orange-50",
    border: "border-orange-500",
    text: "text-orange-700",
    hover: "hover:bg-orange-100",
  },
];

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3001" // Local development server
  : ""; // Production - use relative URL

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the appropriate API endpoint based on environment
      const apiUrl = import.meta.env.DEV
        ? `${API_BASE_URL}/api/calendar/events` // Local development
        : "/.netlify/functions/getCalendarEvents"; // Production

      console.log("Fetching events from:", apiUrl);

      const response = await fetch(apiUrl);

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid content type:", contentType);
        console.error("Response text:", text);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to fetch events");
      }

      const data = await response.json();
      console.log("Received events:", data.length);

      // Assign colors to events that don't have them
      const eventsWithColors = data.map(
        (event: CalendarEvent, index: number) => ({
          ...event,
          colorId: event.colorId || String((index % EVENT_COLORS.length) + 1),
        })
      );
      setEvents(eventsWithColors);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDay({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events.filter((event) =>
      isSameDay(new Date(event.start.dateTime), day)
    );
  };

  const getEventColor = (colorId?: string) => {
    const color = EVENT_COLORS.find((c) => c.id === colorId) || EVENT_COLORS[0];
    return {
      light: color.light,
      border: color.border,
      text: color.text,
      hover: color.hover,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-red-600 mb-2">Error loading calendar</div>
        <div className="text-sm text-gray-600 mb-4">{error}</div>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 md:p-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
              )
            }
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600"
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
              )
            }
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 py-1 sm:py-1.5 bg-white"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day: Date) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`
                aspect-square min-h-[32px] sm:min-h-[35px] md:min-h-[40px] lg:min-h-[45px]
                p-0.5 sm:p-0.5 md:p-1
                ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                ${isCurrentDay ? "bg-blue-50" : ""}
                ${
                  selectedDate && isSameDay(day, selectedDate)
                    ? "bg-purple-50"
                    : ""
                }
                cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors
                touch-manipulation
                flex flex-col items-center
                relative
                group
              `}
            >
              <div
                className={`
                  w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5
                  flex items-center justify-center
                  rounded-full
                  text-[10px] sm:text-xs md:text-xs lg:text-sm font-medium
                  ${
                    isCurrentDay
                      ? "bg-blue-500 text-white"
                      : isCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-400"
                  }
                  mb-0.5
                  transition-colors
                  group-hover:bg-gray-100
                `}
              >
                {format(day, "d")}
              </div>
              <div className="w-full space-y-0.5 mt-0.5">
                {dayEvents.slice(0, 2).map((event) => {
                  const color = getEventColor(event.colorId);
                  return (
                    <div
                      key={event.id}
                      className={`
                        text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs
                        px-1 py-0.5
                        rounded-full truncate
                        ${color.light} ${color.border} ${color.text}
                        border-l-2 ${color.hover}
                        leading-tight
                        shadow-sm
                      `}
                    >
                      {event.summary}
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-500 text-center">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 max-w-[95vw] sm:max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                Events for {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1">
              {getEventsForDay(selectedDate).map((event) => {
                const color = getEventColor(event.colorId);
                return (
                  <div
                    key={event.id}
                    className={`
                      p-2 sm:p-3 rounded-lg
                      ${color.light} ${color.border} ${color.text}
                      border-l-4
                      shadow-sm
                      hover:shadow-md
                      transition-shadow
                    `}
                  >
                    <h4 className="font-medium text-sm sm:text-base">
                      {event.summary}
                    </h4>
                    <p className="text-xs sm:text-sm">
                      {format(new Date(event.start.dateTime), "h:mm a")} -
                      {format(new Date(event.end.dateTime), "h:mm a")}
                    </p>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-3 sm:mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
