import { User, UserWithoutPassword } from '../types/users';

/**
 * ユーザー配列からパスワードを除外して返す
 */
export const removePasswordFromUsers = (users: User[]): UserWithoutPassword[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return users.map(({ password, ...user }) => user);
};

/**
 * 単一のユーザーからパスワードを除外して返す
 */
export const removePasswordFromUser = (user: User): UserWithoutPassword => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

