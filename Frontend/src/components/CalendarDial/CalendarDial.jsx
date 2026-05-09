import React, { useEffect, useMemo, useState } from 'react'
import './CalendarDial.css'

function pad(n) {
  return n.toString().padStart(2, '0')
}

export default function CalendarDial({ value, onChange }) {
  const today = new Date()
  const minDate = new Date(today)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 30) // Allow selection up to 30 days from now

  const initial = useMemo(() => {
    if (!value) {
      return { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() }
    }
    const parts = value.split('-')
    if (parts.length === 3) {
      return { year: Number(parts[0]), month: Number(parts[1]), day: Number(parts[2]) }
    }
    return { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() }
  }, [value])

  const [day, setDay] = useState(initial.day)
  const [month, setMonth] = useState(initial.month)
  const [year, setYear] = useState(initial.year)

  useEffect(() => {
    setDay(initial.day)
    setMonth(initial.month)
    setYear(initial.year)
  }, [initial.day, initial.month, initial.year])

  useEffect(() => {
    if (onChange) onChange(`${year}-${pad(month)}-${pad(day)}`)
  }, [year, month, day, onChange])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getDaysInMonth = (m, y) => new Date(y, m, 0).getDate()
  const maxDays = getDaysInMonth(month, year)
  const days = Array.from({ length: maxDays }, (_, i) => i + 1)

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() + i)

  // Helper to check if date is disabled
  const isDateDisabled = (d, m, y) => {
    const selected = new Date(y, m - 1, d)
    return selected < minDate || selected > maxDate
  }

  const displayDate = new Date(year, month - 1, day)
  const displayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(displayDate)

  return (
    <div className="calendar-dial">
      <div className="calendar-display" aria-hidden>
        <div className="calendar-display-date">{displayFormatted}</div>
      </div>

      <div className="calendar-controls">
        <div className="calendar-wheel">
          <label>Month</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Month">
            {months.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
        </div>

        <div className="calendar-wheel">
          <label>Day</label>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} aria-label="Day">
            {days.map((d) => {
              const disabled = isDateDisabled(d, month, year)
              return (
                <option key={d} value={d} disabled={disabled}>
                  {pad(d)}
                </option>
              )
            })}
          </select>
        </div>

        <div className="calendar-wheel">
          <label>Year</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Year">
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="calendar-help-text">Select a date within 30 days</p>
    </div>
  )
}
