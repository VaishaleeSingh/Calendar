'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  format, addMonths, subMonths, setMonth, setYear,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay,
  isWithinInterval, isBefore, isToday,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, CalendarDays,
  StickyNote, Trash2, Thermometer, Droplets, Wind,
  ChevronDown, Flag, BookOpen, Plus,
} from 'lucide-react';
import styles from './Calendar.module.css';

// ─── Season Config ────────────────────────────────────────────────
const SEASONS = {
  spring: {
    label: 'Spring', emoji: '🌸', months: [2, 3, 4],
    img: '/assets/spring.png',
    weather: { icon: '🌤', temp: '18°C', wind: 'Gentle 12km/h', hum: '65%' },
    desc: 'Blossom Season',
  },
  summer: {
    label: 'Summer', emoji: '☀️', months: [5, 6, 7],
    img: '/assets/summer.png',
    weather: { icon: '☀️', temp: '32°C', wind: 'Warm 8km/h', hum: '45%' },
    desc: 'Peak Sunshine',
  },
  autumn: {
    label: 'Autumn', emoji: '🍂', months: [8, 9, 10],
    img: '/assets/autumn.png',
    weather: { icon: '🍃', temp: '14°C', wind: 'Crisp 22km/h', hum: '72%' },
    desc: 'Golden Harvest',
  },
  winter: {
    label: 'Winter', emoji: '❄️', months: [11, 0, 1],
    img: '/assets/winter.png',
    weather: { icon: '❄️', temp: '3°C', wind: 'Brisk 28km/h', hum: '80%' },
    desc: 'Frost & Calm',
  },
};

// Holidays are now fetched dynamically from Google Calendar API.

const getHoliday = (date, apiHolidays = {}) => {
  const yyyymmdd = format(date, 'yyyy-MM-dd');
  return apiHolidays[yyyymmdd] || null;
};

const HOLIDAY_COLORS = {
  national: '#e8638c',
  india: '#f7a000',
  international: '#4a7fe8',
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getSeason = (monthIdx) =>
  Object.entries(SEASONS).find(([, v]) => v.months.includes(monthIdx))?.[0] ?? 'spring';

// Generate year range around today
const getYearRange = () => {
  const y = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => y - 2 + i);
};

// ─── Particle Canvas ──────────────────────────────────────────────
function SeasonCanvas({ season }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const EMOJIS = {
      spring: ['🌸', '🌺', '🦋'],
      summer: ['☀️', '🌊', '🌴'],
      autumn: ['🍂', '🍁', '🌾'],
      winter: ['❄️', '⛄', '✨'],
    };
    const emojis = EMOJIS[season];
    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: 14 + Math.random() * 16,
      vx: (Math.random() - 0.5) * 0.5,
      vy: season === 'winter' ? -0.3 - Math.random() * 0.3 : 0.25 + Math.random() * 0.4,
      rot: Math.random() * 360, vr: (Math.random() - 0.5) * 1.2,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      alpha: 0.3 + Math.random() * 0.35,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.font = `${p.size}px serif`;
        ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillText(p.emoji, 0, 0); ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 30) { p.y = -30; p.x = Math.random() * W; }
        if (p.y < -30) p.y = H + 30;
        if (p.x > W + 30) p.x = -30;
        if (p.x < -30) p.x = W + 30;
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [season]);

  return <canvas ref={canvasRef} id="season-canvas" />;
}

// ─── Custom Dropdown ──────────────────────────────────────────────
function Dropdown({ value, options, onChange, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button className={styles.dropdownTrigger} onClick={() => setOpen(o => !o)}>
        <span>{label}</span>
        <ChevronDown size={13} className={open ? styles.dropChevronOpen : ''} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {options.map(opt => (
              <button
                key={opt.value}
                className={`${styles.dropdownItem} ${opt.value === value ? styles.dropdownItemActive : ''}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────
export default function Calendar() {
  const today = new Date();

  const [current, setCurrent]   = useState(today);
  const [selection, setSel]     = useState({ start: null, end: null });
  const [hoverDay, setHover]    = useState(null);
  // notes[YYYY-MM-DD] = string  |  notes[YYYY-MM-memo] = string
  const [notes, setNotes]       = useState({});
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'holidays'
  const [apiHolidays, setApiHolidays] = useState({});
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);

  // ── Google Calendar API Integration ───────────────────────────
  const fetchedYears = useRef(new Set());

  useEffect(() => {
    const fetchGoogleHolidays = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const calendarId = process.env.NEXT_PUBLIC_CALENDAR_ID || 'vaishalisinghsln5@gmail.com';

      if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
        return;
      }

      const year = current.getFullYear();
      // Simple cache check to avoid redundant API hits for the same year
      if (fetchedYears.current.has(year)) {
        return;
      }

      setIsLoadingHolidays(true);
      try {
        // Fetch events for the current year
        const timeMin = new Date(year, 0, 1).toISOString();
        const timeMax = new Date(year, 11, 31, 23, 59, 59).toISOString();
        
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data.items) {
          const mapped = {};
          data.items.forEach(ev => {
            const dateStr = ev.start.date || ev.start.dateTime.split('T')[0];
            // Format for getHoliday consistency
            mapped[dateStr] = {
              name: ev.summary,
              type: ev.description?.toLowerCase().includes('national') ? 'national' : 'international',
              isApi: true
            };
          });
          
          setApiHolidays(prev => ({ ...prev, ...mapped }));
          fetchedYears.current.add(year);
        }
      } catch (err) {
        console.error('Error fetching calendar events:', err);
      } finally {
        setIsLoadingHolidays(false);
      }
    };

    fetchGoogleHolidays();
  }, [current.getFullYear()]);

  // ── Persist ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura_notes_v2');
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_notes_v2', JSON.stringify(notes));
  }, [notes]);

  // ── Season ─────────────────────────────────────────────────────
  const season     = getSeason(current.getMonth());
  const seasonData = SEASONS[season];

  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  // ── Calendar grid ──────────────────────────────────────────────
  const monthStart = startOfMonth(current);
  const gridStart  = startOfWeek(monthStart);
  const gridEnd    = endOfWeek(endOfMonth(current));
  const days       = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // ── Navigation helpers ─────────────────────────────────────────
  const goMonth = (dir) => setCurrent(dir === 1 ? addMonths(current, 1) : subMonths(current, 1));

  const selectMonth = (mIdx) => setCurrent(setMonth(current, mIdx));
  const selectYear  = (yr)   => setCurrent(setYear(current, yr));

  // ── Date selection ─────────────────────────────────────────────
  const handleDay = useCallback((day) => {
    if (!selection.start || (selection.start && selection.end)) {
      setSel({ start: day, end: null });
    } else {
      const s = selection.start;
      if (isSameDay(day, s))        setSel({ start: null, end: null });
      else if (isBefore(day, s))    setSel({ start: day, end: s });
      else                          setSel({ start: s, end: day });
    }
  }, [selection]);

  const isStart  = (d) => selection.start && isSameDay(d, selection.start);
  const isEnd    = (d) => selection.end   && isSameDay(d, selection.end);
  const isRanged = (d) => {
    if (!selection.start || !selection.end) return false;
    return isWithinInterval(d, { start: selection.start, end: selection.end });
  };
  const isHovered = (d) => {
    if (!selection.start || selection.end || !hoverDay) return false;
    const lo = isBefore(selection.start, hoverDay) ? selection.start : hoverDay;
    const hi = isBefore(selection.start, hoverDay) ? hoverDay : selection.start;
    return isWithinInterval(d, { start: lo, end: hi });
  };

  // ── Note helpers ───────────────────────────────────────────────
  const dayKey   = (d) => format(d, 'yyyy-MM-dd');
  const monthKey = format(current, 'yyyy-MM') + '-memo';
  const selKey   = selection.start ? dayKey(selection.start) : null;

  const setNote    = (key, val) => setNotes(prev => ({ ...prev, [key]: val }));
  const deleteNote = (key)     => setNotes(prev => { const n = { ...prev }; delete n[key]; return n; });

  // Collect all date notes (not memos) sorted ascending
  const allDateNotes = Object.entries(notes)
    .filter(([k, v]) => !k.endsWith('-memo') && v && v.trim())
    .sort(([a], [b]) => (a > b ? 1 : -1));

  const isSingle = selection.start && !selection.end;

  // ── Cell class ─────────────────────────────────────────────────
  const cellClass = (day) => {
    const out    = !isSameMonth(day, monthStart);
    const sel    = isStart(day) || isEnd(day);
    const ranged = isRanged(day) && !sel;
    const hover  = isHovered(day) && !sel;
    const start  = isStart(day) && selection.end;
    const end    = isEnd(day)   && selection.start;
    const single = (isStart(day) || isEnd(day)) && isSingle;
    const isSun  = day.getDay() === 0;

    let c = styles.day;
    if (out)           c += ` ${styles.dayOut}`;
    if (isSun && !out) c += ` ${styles.daySunday}`;
    if (isToday(day) && !sel) c += ` ${styles.dayToday}`;
    if (sel)           c += ` ${styles.daySelected}`;
    if (single)        c += ` ${styles.daySingle}`;
    if (ranged||hover) c += ` ${styles.dayInRange}`;
    if (start && !single) c += ` ${styles.dayRangeStart}`;
    if (end   && !single) c += ` ${styles.dayRangeEnd}`;
    return c;
  };

  // ── Dropdown options ───────────────────────────────────────────
  const yearOptions  = getYearRange().map(y => ({ value: y, label: String(y) }));
  const monthOptions = MONTHS.map((m, i) => ({ value: i, label: m }));

  return (
    <>
      <SeasonCanvas season={season} />

      <div className={styles.wrapper}>
        {/* ───── Hero Panel ───────────────────────────────────── */}
        <section className={styles.hero}>
          <AnimatePresence mode="wait">
            <motion.img
              key={seasonData.img}
              src={seasonData.img}
              alt={seasonData.desc}
              className={styles.heroImg}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
            />
          </AnimatePresence>
          <div className={styles.heroGrad} />

          <div className={styles.weatherPill}>
            <span>{seasonData.weather.icon}</span>
            <span>{seasonData.weather.temp}</span>
            <span style={{opacity:0.5}}>·</span>
            <Wind size={11}/>
            <span>{seasonData.weather.wind}</span>
          </div>

          <div className={styles.seasonBadge}>
            <span className={styles.seasonEmoji}>{seasonData.emoji}</span>
            {seasonData.desc}
          </div>

          <div className={styles.heroContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={format(current,'yyyy-MM')}
                initial={{ opacity:0, y:30 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-20 }}
                transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
              >
                <p className={styles.heroYear}>{format(current,'yyyy')}</p>
                <h1 className={styles.heroMonth}>{format(current,'MMMM')}</h1>
                <div className={styles.heroMeta}>
                  <span className={styles.metaRow}><Thermometer size={12}/> {seasonData.weather.temp} — {seasonData.label}</span>
                  <span className={styles.metaRow}><Droplets size={12}/> Humidity {seasonData.weather.hum}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.navBtns}>
            <button className={styles.navBtn} onClick={() => goMonth(-1)}><ChevronLeft size={18}/></button>
            <button className={styles.navBtn} onClick={() => goMonth(1)}><ChevronRight size={18}/></button>
          </div>
        </section>

        {/* ───── Right Panel ──────────────────────────────────── */}
        <section className={styles.panel}>

          {/* Header with dropdowns */}
          <div className={styles.panelHeader}>
            <div className={styles.brand}>
              <div className={styles.brandIcon}><CalendarDays size={20}/></div>
              <div>
                <p className={styles.brandSub}>Aura · Season Planner</p>
                <p className={styles.brandName}>Calendar</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <Dropdown
                value={current.getMonth()}
                options={monthOptions}
                onChange={selectMonth}
                label={format(current,'MMM')}
              />
              <Dropdown
                value={current.getFullYear()}
                options={yearOptions}
                onChange={selectYear}
                label={String(current.getFullYear())}
              />
              <button
                className={styles.todayBtn}
                onClick={() => { setCurrent(today); setSel({start:null,end:null}); }}
              >
                Today
              </button>
            </div>
          </div>

          <div className={styles.body}>
            {/* ── Grid column ── */}
            <div className={styles.gridCol}>
              <div className={styles.dayLabels}>
                {DAYS.map(d => (
                  <div
                    key={d}
                    className={`${styles.dayLabel} ${d === 'Sun' ? styles.daySundayLabel : ''}`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className={styles.dayGrid}>
                {days.map((day) => {
                  const nk      = dayKey(day);
                  const hasNote = !!notes[nk];
                  const holiday = getHoliday(day, apiHolidays);
                  const sel     = isStart(day) || isEnd(day);
                  const inCur   = isSameMonth(day, monthStart);

                  return (
                    <motion.div
                      key={nk}
                      className={cellClass(day)}
                      onClick={() => inCur && handleDay(day)}
                      onMouseEnter={() => setHover(day)}
                      onMouseLeave={() => setHover(null)}
                      whileHover={{ scale: inCur ? 1.08 : 1 }}
                      whileTap={{ scale: 0.93 }}
                      transition={{ type:'spring', stiffness:400, damping:22 }}
                      title={holiday ? holiday.name : undefined}
                    >
                      <span>{format(day,'d')}</span>
                      {holiday && inCur && (
                        <span
                          className={styles.holidayDot}
                          style={{ background: HOLIDAY_COLORS[holiday.type] }}
                        />
                      )}
                      {hasNote && !sel && !holiday && (
                        <span className={styles.noteDot}/>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Selection status */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selKey ?? 'none'}
                  className={styles.selBox}
                  initial={{ opacity:0, y:8 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }}
                  transition={{ duration:0.3 }}
                >
                  {selection.start ? (
                    <>
                      <p className={styles.selLabel}>Selected Range</p>
                      <p className={styles.selValue}>
                        {format(selection.start,'MMM dd')}
                        {selection.end
                          ? ` — ${format(selection.end,'MMM dd, yyyy')}`
                          : ` — ${hoverDay ? format(hoverDay,'MMM dd') : 'pick end date…'}`}
                      </p>
                    </>
                  ) : (
                    <p className={styles.selHint}>{seasonData.emoji} Click a date to select</p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Holiday legend */}
              <div className={styles.legendRow}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background:'#e8638c'}}/> National
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background:'#f7a000'}}/> India
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background:'#4a7fe8'}}/> International
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background:'var(--col-accent)'}}/> Note
                </span>
              </div>
            </div>

            {/* ── Notes & Holidays column ── */}
            <div className={styles.notesCol}>

              {/* Tab switcher */}
              <div className={styles.tabBar}>
                <button
                  className={`${styles.tab} ${activeTab === 'notes' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('notes')}
                >
                  <StickyNote size={14}/> Notes
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'holidays' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('holidays')}
                >
                  <Flag size={14}/> Holidays
                </button>
              </div>

              {/* ── NOTES TAB ── */}
              {activeTab === 'notes' && (
                <div className={styles.tabContent}>

                  {/* Monthly memo — always visible */}
                  <div className={styles.noteCard}>
                    <div className={styles.noteLabel}>
                      <span>{seasonData.emoji} {format(current,'MMMM yyyy')} Memo</span>
                    </div>
                    <textarea
                      className={styles.noteTextarea}
                      placeholder={`Goals & plans for ${format(current,'MMMM')}…`}
                      value={notes[monthKey] ?? ''}
                      onChange={e => setNote(monthKey, e.target.value)}
                    />
                  </div>

                  {/* Selected date note */}
                  <AnimatePresence mode="wait">
                    {selection.start && (
                      <motion.div
                        key={selKey}
                        className={`${styles.noteCard} ${styles.noteCardAccent}`}
                        initial={{ opacity:0, x:16 }}
                        animate={{ opacity:1, x:0 }}
                        exit={{ opacity:0, x:-16 }}
                        transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                      >
                        <div className={styles.noteLabel}>
                          <span>
                            📌 {format(selection.start,'MMM dd')}
                            {selection.end && ` – ${format(selection.end,'MMM dd')}`}
                          </span>
                          <button className={styles.trashBtn} onClick={() => deleteNote(selKey)}>
                            <Trash2 size={13}/>
                          </button>
                        </div>
                        <textarea
                          className={styles.noteTextarea}
                          placeholder="Events, tasks, reminders…"
                          value={notes[selKey] ?? ''}
                          onChange={e => setNote(selKey, e.target.value)}
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* All saved notes list */}
                  {allDateNotes.length > 0 && (
                    <div className={styles.savedSection}>
                      <p className={styles.savedTitle}><BookOpen size={13}/> All Saved Notes</p>
                      <div className={styles.savedList}>
                        {allDateNotes.map(([key, text]) => (
                          <motion.div
                            key={key}
                            className={styles.savedNote}
                            layout
                            initial={{ opacity:0, y:6 }}
                            animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, height:0 }}
                          >
                            <div className={styles.savedNoteHeader}>
                              <span className={styles.savedNoteDate}>{format(new Date(key),'MMM dd, yyyy')}</span>
                              <button className={styles.trashBtn} onClick={() => deleteNote(key)}>
                                <Trash2 size={12}/>
                              </button>
                            </div>
                            <p className={styles.savedNoteText}>{text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!selection.start && allDateNotes.length === 0 && (
                    <div className={styles.emptyNotes}>
                      <div className={styles.emptyIcon}><StickyNote size={22}/></div>
                      <p className={styles.emptyText}>Click a date to add notes. Saved notes appear here.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── HOLIDAYS TAB ── */}
              {activeTab === 'holidays' && (
                <div className={styles.tabContent}>
                  <p className={styles.savedTitle} style={{marginBottom:12}}>
                    <Flag size={13}/> Holidays in {format(current,'MMMM yyyy')}
                  </p>
                  {(() => {
                    const yr = current.getFullYear();
                    const mo = current.getMonth();
                    const monthHolidays = days
                      .filter(d => isSameMonth(d, monthStart))
                      .map(d => ({ date: d, holiday: getHoliday(d, apiHolidays) }))
                      .filter(({ holiday }) => holiday);

                    return monthHolidays.length > 0 ? (
                      <div className={styles.holidayList}>
                        {monthHolidays.map(({ date, holiday }) => (
                          <motion.div
                            key={dayKey(date)}
                            className={styles.holidayItem}
                            style={{ borderLeftColor: HOLIDAY_COLORS[holiday.type] }}
                            initial={{ opacity:0, x:10 }}
                            animate={{ opacity:1, x:0 }}
                          >
                            <div className={styles.holidayDate}>
                              <span className={styles.holidayDay}>{format(date,'d')}</span>
                              <span className={styles.holidayDow}>{format(date,'EEE')}</span>
                            </div>
                            <div className={styles.holidayInfo}>
                              <p className={styles.holidayName}>{holiday.name}</p>
                              <span
                                className={styles.holidayType}
                                style={{ color: HOLIDAY_COLORS[holiday.type] }}
                              >
                                {holiday.type}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyNotes} style={{flex:'none',marginTop:8}}>
                        <div className={styles.emptyIcon}><Flag size={20}/></div>
                        <p className={styles.emptyText}>No holidays this month.</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
