import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarPicker({ selectedDate, onSelect, onClose }) {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  // Build the grid of days for the current view month
  const buildGrid = () => {
    const start = startOfWeek(startOfMonth(viewDate));
    const end = endOfWeek(endOfMonth(viewDate));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const days = buildGrid();

  const handleSelect = (day) => {
    onSelect(day);
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-blue-600">
          <button
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="p-1.5 rounded-lg hover:bg-blue-500 active:bg-blue-700 text-white transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-white font-bold text-base">
            {format(viewDate, 'MMMM yyyy')}
          </h2>

          <button
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-1.5 rounded-lg hover:bg-blue-500 active:bg-blue-700 text-white transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="text-center text-xs font-bold text-slate-400 py-2"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 p-3 gap-1">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, viewDate);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={idx}
                onClick={() => handleSelect(day)}
                className={`
                  aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-100
                  ${!isCurrentMonth ? 'text-slate-300' : ''}
                  ${isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-md scale-110'
                    : isTodayDate && isCurrentMonth
                    ? 'bg-blue-100 text-blue-700 font-bold ring-2 ring-blue-400'
                    : isCurrentMonth
                    ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                    : 'hover:bg-slate-50'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              handleSelect(today);
            }}
            className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 active:bg-blue-200 transition-colors"
          >
            Go to Today
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center gap-1"
          >
            <X size={15} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
