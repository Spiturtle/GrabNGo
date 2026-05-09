import React, { useEffect, useMemo, useState } from 'react'
import './ClockDial.css'

function pad(n) {
  return n.toString().padStart(2, '0')
}

export default function ClockDial({ value, onChange }) {
  const initial = useMemo(() => {
    if (!value) return { hour: '12', minute: '00', period: 'PM' }
    const m = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!m) return { hour: '12', minute: '00', period: 'PM' }
    return { hour: String(Number(m[1])), minute: m[2], period: m[3].toUpperCase() }
  }, [value])

  const [hour, setHour] = useState(initial.hour)
  const [minute, setMinute] = useState(initial.minute)
  const [period, setPeriod] = useState(initial.period)

  useEffect(() => {
    // keep controlled when parent changes value
    setHour(initial.hour)
    setMinute(initial.minute)
    setPeriod(initial.period)
  }, [initial.hour, initial.minute, initial.period])

  useEffect(() => {
    if (onChange) onChange(`${hour}:${pad(minute)} ${period}`)
  }, [hour, minute, period, onChange])

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1))
  const minutes = Array.from({ length: 60 }, (_, i) => pad(i))

  return (
    <div className="clock-dial">
      <div className="clock-display" aria-hidden>
        <div className="clock-display-time">{hour}:{pad(minute)} <span className="clock-display-period">{period}</span></div>
      </div>

      <div className="clock-controls">
        <div className="clock-wheel">
          <label>Hour</label>
          <select value={hour} onChange={(e) => setHour(String(Number(e.target.value)))} aria-label="Hour">
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div className="clock-wheel">
          <label>Minute</label>
          <select value={minute} onChange={(e) => setMinute(e.target.value)} aria-label="Minute">
            {minutes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="clock-wheel period-wheel">
          <label>AM / PM</label>
          <div className="period-toggle" role="radiogroup" aria-label="AM or PM">
            <button
              type="button"
              className={period === 'AM' ? 'active' : ''}
              onClick={() => setPeriod('AM')}
              aria-pressed={period === 'AM'}
            >
              AM
            </button>
            <button
              type="button"
              className={period === 'PM' ? 'active' : ''}
              onClick={() => setPeriod('PM')}
              aria-pressed={period === 'PM'}
            >
              PM
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
