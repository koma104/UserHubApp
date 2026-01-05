import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser, User } from '../types/users';
import {
  getUsers,
  getCurrentUser,
  saveCurrentUser,
  removeCurrentUser,
} from '../utils/localStorage';

type AuthContextType = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    // LocalStorageから認証状態を復元
    const storedUser = getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = getUsers();
      const foundUser = users.find((u: User) => u.email === email && u.password === password);

      if (foundUser) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = foundUser;
        setCurrentUser(userWithoutPassword);
        saveCurrentUser(userWithoutPassword);
        return true;
      }

      return false;
    } catch (error) {
      console.error('ログイン処理中にエラーが発生しました:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    removeCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
