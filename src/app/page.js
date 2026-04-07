import Calendar from '@/components/Calendar/Calendar';

export const metadata = {
  title: 'Aura Calendar — Seasonal Planner',
  description: 'A premium, season-aware interactive wall calendar with date range selection, integrated notes, and floating ambient particles.',
};

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <Calendar />
    </main>
  );
}
