import { ApiUser, User } from '../types/users';
import { saveUsers } from './localStorage';

/**
 * JSONPlaceholder APIからユーザーデータを取得
 */
export const fetchUsersFromAPI = async (): Promise<ApiUser[]> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/');
    if (!response.ok) {
      throw new Error('ユーザーデータの取得に失敗しました');
    }
    const users: ApiUser[] = await response.json();
    return users;
  } catch (error) {
    console.error('APIからのユーザー取得エラー:', error);
    throw error;
  }
};

/**
 * JSONPlaceholderのユーザーデータをUser型に変換
 * デフォルトパスワードを設定（実際のアプリでは適切な方法で管理）
 */
export const convertApiUsersToUsers = (apiUsers: ApiUser[]): User[] => {
  return apiUsers.map((user) => ({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    password: 'password123', // デフォルトパスワード（実際のアプリでは適切に管理）
  }));
};

/**
 * APIからユーザーデータを取得してLocalStorageに保存
 * 既に初期化済みの場合はスキップ
 */
export const initializeUsersFromAPI = async (): Promise<void> => {
  try {
    // 既に初期化済みの場合はスキップ
    if (localStorage.getItem('usersInitialized') === 'true') {
      return;
    }

    const apiUsers = await fetchUsersFromAPI();
    const users = convertApiUsersToUsers(apiUsers);
    saveUsers(users);
    localStorage.setItem('usersInitialized', 'true');
  } catch (error) {
    console.error('ユーザーデータの初期化に失敗しました:', error);
    // エラーが発生してもアプリは動作するようにする
  }
};

