import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const themes = [
    { id: 'light' as const, name: 'Светлая', icon: '☀️', description: 'Классическая светлая тема' },
    { id: 'dark' as const, name: 'Тёмная', icon: '🌙', description: 'Тёмная тема для комфорта глаз' },
    { id: 'cosmic' as const, name: 'Космическая', icon: '🌌', description: 'Космос с планетами и звёздами' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Тема оформления</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === t.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-4xl mb-2">{t.icon}</div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-gray-600 mt-1">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Информация об аккаунте</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Роль:</span>
              <span className="font-medium">
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
          <button
            onClick={() => alert('Функция изменения пароля будет доступна в следующей версии')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Изменить пароль
          </button>
          <p className="text-sm text-gray-500 mt-2">Функция в разработке</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" defaultChecked />
              <span className="text-gray-700">Email уведомления о новых клиентах</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" defaultChecked />
              <span className="text-gray-700">Email уведомления о новых заказах</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">Функция в разработке</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-600">Опасная зона</h2>
          <button
            onClick={() => {
              if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо!')) {
                alert('Функция удаления аккаунта будет доступна в следующей версии');
              }
            }}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Удалить аккаунт
          </button>
          <p className="text-sm text-gray-500 mt-2">Это действие необратимо</p>
        </div>
      </div>
    </div>
  );
}
