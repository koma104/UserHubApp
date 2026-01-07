import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, saveUsers, saveCurrentUser } from '../utils/localStorage';
import { removePasswordFromUser } from '../utils/userUtils';
import { User } from '../types/users';

const UserEdit = () => {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();

  // 自分のプロフィールのみ編集可能
  const canEdit = currentUser?.id === userId;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      // 自分のプロフィールでない場合は一覧にリダイレクト
      if (!canEdit) {
        navigate('/users');
        return;
      }
      loadUser(userId);
    }
  }, [userId, canEdit, navigate]);

  const loadUser = (userId: string) => {
    try {
      const users = getUsers();
      const user = users.find((u) => u.id === userId);
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: '',
          confirmPassword: '',
        });
      } else {
        setError('ユーザーが見つかりません');
      }
    } catch (error) {
      console.error('ユーザーの読み込みに失敗しました:', error);
      setError('ユーザーの読み込みに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 自分のプロフィールでない場合は編集不可
    if (!canEdit) {
      setError('自分のプロフィールのみ編集できます');
      return;
    }

    // バリデーション
    if (!formData.name.trim()) {
      setError('名前を入力してください');
      return;
    }
    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setIsLoading(true);

    try {
      const users = getUsers();

      // 既存ユーザー更新（自分のプロフィールのみ）
      const userIndex = users.findIndex((u: User) => u.id === userId);
      if (userIndex === -1) {
        setError('ユーザーが見つかりません');
        setIsLoading(false);
        return;
      }

      // メールアドレスの重複チェック（自分以外）
      const emailExists = users.some(
        (u: User, index: number) => u.email === formData.email && index !== userIndex
      );
      if (emailExists) {
        setError('このメールアドレスは既に使用されています');
        setIsLoading(false);
        return;
      }

      // ユーザー情報を更新
      const updatedUser: User = {
        ...users[userIndex],
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      users[userIndex] = updatedUser;
      saveUsers(users);

      // 現在のログインユーザーを更新（パスワードを除外）
      const userWithoutPassword = removePasswordFromUser(updatedUser);
      saveCurrentUser(userWithoutPassword);
      updateCurrentUser(userWithoutPassword);

      navigate('/users');
    } catch (error) {
      console.error('ユーザーの保存に失敗しました:', error);
      setError('ユーザーの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">UserHub App</h1>
            </div>
            <button
              onClick={() => navigate('/users')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              一覧に戻る
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">プロフィール変更</h2>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  名前
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード (変更する場合のみ入力)
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {formData.password && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    パスワード確認
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserEdit;
