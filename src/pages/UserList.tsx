import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers } from '../utils/localStorage';
import { removePasswordFromUsers } from '../utils/userUtils';
import { UserWithoutPassword } from '../types/users';

const UserList = () => {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const allUsers = getUsers();
      const usersWithoutPassword = removePasswordFromUsers(allUsers);
      setUsers(usersWithoutPassword);
    } catch (error) {
      console.error('ユーザーの読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (userId: string) => {
    navigate(`/users/${userId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">UserHub App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                ログイン中: {currentUser?.name || currentUser?.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">ユーザー一覧</h2>
            <button
              onClick={() => navigate(`/users/${currentUser?.id}/edit`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              自分のプロフィールを編集
            </button>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">ユーザーデータを読み込み中...</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li key={user.id}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2 items-center">
                        {currentUser?.id === user.id ? (
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            自分のプロフィールを編集
                          </button>
                        ) : (
                          <span className="px-3 py-1 text-sm text-gray-400">閲覧のみ</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserList;
