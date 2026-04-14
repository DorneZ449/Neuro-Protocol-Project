import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await api.put('/profile/update', { name, avatar_url: avatarUrl });
      setMessage('Профиль успешно обновлён');
      window.location.reload();
    } catch (error) {
      setMessage('Ошибка обновления профиля');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6 pb-6 border-b">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-3xl">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </span>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('успешно') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL аватарки
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Вставьте ссылку на изображение (например, с Imgur, Gravatar или другого хостинга)
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Как загрузить аватарку:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Загрузите изображение на <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline">Imgur.com</a></li>
              <li>Скопируйте прямую ссылку на изображение</li>
              <li>Вставьте ссылку в поле выше</li>
            </ol>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
}
