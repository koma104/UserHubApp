import { User } from '../types/users';

/**
 * LocalStorageから全ユーザーを取得
 */
export const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('ユーザーの取得に失敗しました:', error);
    return [];
  }
};

/**
 * LocalStorageにユーザーを保存
 */
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('ユーザーの保存に失敗しました:', error);
    throw error;
  }
};

/**
 * 現在のログインユーザーを取得
 */
export const getCurrentUser = (): import('../types/users').CurrentUser | null => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error('現在のユーザー情報の取得に失敗しました:', error);
    return null;
  }
};

/**
 * 現在のログインユーザーを保存
 */
export const saveCurrentUser = (user: import('../types/users').CurrentUser): void => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('現在のユーザー情報の保存に失敗しました:', error);
    throw error;
  }
};

/**
 * 現在のログインユーザーを削除
 */
export const removeCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

