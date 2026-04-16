import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'ru': ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'call' | 'email';
  clientName: string;
}

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { data: interactions } = useQuery({
    queryKey: ['calendar-interactions'],
    queryFn: async () => {
      const response = await api.get('/interactions');
      return response.data;
    },
  });

  const events: CalendarEvent[] = (interactions || []).map((interaction: any) => ({
    id: interaction.id,
    title: `${interaction.type} - ${interaction.client_name || 'Клиент'}`,
    start: new Date(interaction.interaction_date),
    end: new Date(new Date(interaction.interaction_date).getTime() + 60 * 60 * 1000),
    type: interaction.type,
    clientName: interaction.client_name || 'Неизвестно',
  }));

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors = {
      meeting: { backgroundColor: '#3b82f6', color: 'white' },
      call: { backgroundColor: '#10b981', color: 'white' },
      email: { backgroundColor: '#f59e0b', color: 'white' },
    };

    return {
      style: colors[event.type] || { backgroundColor: '#6b7280', color: 'white' },
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Календарь</h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Встречи</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Звонки</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Email</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6" style={{ height: 'calc(100vh - 250px)', minHeight: '400px', maxHeight: '800px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="ru"
          messages={{
            next: 'Вперёд',
            previous: 'Назад',
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День',
            agenda: 'Повестка',
            date: 'Дата',
            time: 'Время',
            event: 'Событие',
            noEventsInRange: 'Нет событий в этом диапазоне',
          }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedEvent(event)}
        />
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Клиент:</strong> {selectedEvent.clientName}</p>
              <p><strong>Дата:</strong> {format(selectedEvent.start, 'dd MMMM yyyy, HH:mm', { locale: ru })}</p>
              <p><strong>Тип:</strong> {selectedEvent.type}</p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
