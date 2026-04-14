import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
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
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Изменить пароль
          </button>
          <p className="text-sm text-gray-500 mt-2">Функция в разработке</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
              <span className="text-gray-700">Email уведомления о новых клиентах</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
              <span className="text-gray-700">Email уведомления о новых заказах</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">Функция в разработке</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-600">Опасная зона</h2>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            Удалить аккаунт
          </button>
          <p className="text-sm text-gray-500 mt-2">Это действие необратимо</p>
        </div>
      </div>
    </div>
  );
}
