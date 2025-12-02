# UserHub App 実装ステップガイド

実際にコードを書いて実装する際の、具体的なステップバイステップガイドです。

## 🎯 実装の進め方

各ステップを順番に実装してください。わからない部分があれば、`LEARNING_GUIDE.md`で概念を確認してから戻ってきてください。

---

## ステップ1: シンプルなログインページを作成

### 目標
フォームだけのログインページを作成（まだ機能は実装しない）

### 実装内容

1. `src/pages/Login.tsx`を開く
2. 以下のコードを理解しながら書く：

```tsx
import { useState } from 'react';

export default function Login() {
  // 状態を管理するためのuseState
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ページのリロードを防ぐ
    console.log('メール:', email);
    console.log('パスワード:', password);
    // 今はコンソールに表示するだけ
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="メールアドレスを入力"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="パスワードを入力"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 確認ポイント
- [ ] フォームが表示される
- [ ] 入力フィールドに文字を入力できる
- [ ] 送信ボタンを押すとコンソールに値が表示される

---

## ステップ2: LocalStorageにデータを保存・取得

### 目標
LocalStorageの基本的な使い方を理解する

### 実装内容

1. 新しいファイル `src/utils/storage.ts` を作成：

```tsx
// LocalStorageにユーザーデータを保存
export function saveUsers(users: any[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

// LocalStorageからユーザーデータを取得
export function getUsers() {
  const data = localStorage.getItem('users');
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

// テスト用のサンプルデータを保存
export function initializeSampleUsers() {
  const sampleUsers = [
    {
      id: '1',
      name: '山田太郎',
      email: 'yamada@example.com',
      password: 'password123',
    },
    {
      id: '2',
      name: '佐藤花子',
      email: 'sato@example.com',
      password: 'password123',
    },
  ];
  saveUsers(sampleUsers);
  return sampleUsers;
}
```

2. ブラウザのコンソールで試してみる：

```javascript
// 開発者ツールのコンソールで実行
import { initializeSampleUsers, getUsers } from './src/utils/storage';
initializeSampleUsers();
console.log(getUsers());
```

### 確認ポイント
- [ ] LocalStorageにデータが保存される（開発者ツールで確認）
- [ ] データを取得できる

---

## ステップ3: ログイン機能を実装

### 目標
LocalStorageのデータを使ってログインできるようにする

### 実装内容

1. `src/pages/Login.tsx`を更新：

```tsx
import { useState } from 'react';
import { getUsers } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // エラーをリセット

    // LocalStorageからユーザーを取得
    const users = getUsers();
    
    // メールアドレスとパスワードが一致するユーザーを探す
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // ログイン成功
      console.log('ログイン成功:', user);
      // ログイン状態を保存（後でContextで管理する）
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      }));
      alert('ログイン成功！');
    } else {
      // ログイン失敗
      setError('メールアドレスまたはパスワードが正しくありません');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {/* フォームの内容は前のステップと同じ */}
        </form>
      </div>
    </div>
  );
}
```

2. `src/App.tsx`でサンプルデータを初期化：

```tsx
import { useEffect } from 'react';
import { initializeSampleUsers } from './utils/storage';
import Login from './pages/Login';

function App() {
  useEffect(() => {
    // アプリ起動時にサンプルデータを初期化
    if (localStorage.getItem('users') === null) {
      initializeSampleUsers();
    }
  }, []);

  return <Login />;
}
```

### 確認ポイント
- [ ] 正しいメールアドレスとパスワードでログインできる
- [ ] 間違った情報でエラーメッセージが表示される
- [ ] LocalStorageに`currentUser`が保存される

---

## ステップ4: ユーザー一覧ページを作成

### 目標
LocalStorageからユーザーを取得して一覧表示する

### 実装内容

1. `src/pages/UserList.tsx`を作成：

```tsx
import { useState, useEffect } from 'react';
import { getUsers } from '../utils/storage';

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // コンポーネントがマウントされたときにユーザーを取得
    const loadedUsers = getUsers();
    // パスワードを除外
    const usersWithoutPassword = loadedUsers.map(({ password, ...user }) => user);
    setUsers(usersWithoutPassword);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">ユーザー一覧</h1>
      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y">
          {users.map((user) => (
            <li key={user.id} className="p-4">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

2. `src/App.tsx`を更新してルーティングを追加：

```tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeSampleUsers } from './utils/storage';
import Login from './pages/Login';
import UserList from './pages/UserList';

function App() {
  useEffect(() => {
    if (localStorage.getItem('users') === null) {
      initializeSampleUsers();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 確認ポイント
- [ ] `/users`にアクセスするとユーザー一覧が表示される
- [ ] ユーザーの名前とメールアドレスが表示される

---

## ステップ5: Context APIで認証状態を管理

### 目標
ログイン状態をアプリ全体で共有できるようにする

### 実装内容

1. `src/contexts/AuthContext.tsx`を作成（段階的に理解しながら）：

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Contextの型を定義
interface AuthContextType {
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// 2. Contextを作成（初期値はundefined）
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Providerコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  // ページ読み込み時にLocalStorageから認証状態を復元
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ログイン関数
  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  // ログアウト関数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 4. カスタムフック（Contextを使いやすくする）
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

2. `src/App.tsx`を更新してProviderでラップ：

```tsx
import { AuthProvider } from './contexts/AuthContext';
// ... 他のimport

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

3. `src/pages/Login.tsx`を更新してuseAuthを使用：

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  // ... 状態の定義

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/users'); // ログイン成功したらユーザー一覧へ
    } else {
      setError('メールアドレスまたはパスワードが正しくありません');
    }
  };
  // ... 残りのコード
}
```

### 確認ポイント
- [ ] ログインするとユーザー一覧ページに遷移する
- [ ] ページをリロードしてもログイン状態が保持される

---

## ステップ6: 保護されたルートを実装

### 目標
ログインしていない場合はログインページにリダイレクト

### 実装内容

1. `src/App.tsx`にProtectedRouteコンポーネントを追加：

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// AppRoutes内で使用
<Route
  path="/users"
  element={
    <ProtectedRoute>
      <UserList />
    </ProtectedRoute>
  }
/>
```

### 確認ポイント
- [ ] ログインしていない状態で`/users`にアクセスすると`/login`にリダイレクトされる
- [ ] ログイン後は`/users`にアクセスできる

---

## ステップ7: APIからデータを取得

### 目標
JSONPlaceholder APIからユーザーデータを取得

### 実装内容

1. `src/utils/api.ts`を作成：

```tsx
// APIからユーザーを取得
export async function fetchUsersFromAPI() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/');
    if (!response.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('APIエラー:', error);
    throw error;
  }
}

// APIのデータをLocalStorage用の形式に変換
export function convertToLocalStorageUsers(apiUsers: any[]) {
  return apiUsers.map((user) => ({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    password: 'password123', // デフォルトパスワード
  }));
}

// 初期化関数
export async function initializeUsersFromAPI() {
  // 既に初期化済みの場合はスキップ
  if (localStorage.getItem('usersInitialized') === 'true') {
    return;
  }

  try {
    const apiUsers = await fetchUsersFromAPI();
    const localStorageUsers = convertToLocalStorageUsers(apiUsers);
    localStorage.setItem('users', JSON.stringify(localStorageUsers));
    localStorage.setItem('usersInitialized', 'true');
  } catch (error) {
    console.error('初期化エラー:', error);
  }
}
```

2. `src/App.tsx`でアプリ起動時に呼び出す：

```tsx
import { initializeUsersFromAPI } from './utils/api';

function AppRoutes() {
  useEffect(() => {
    initializeUsersFromAPI();
  }, []);
  // ... 残りのコード
}
```

### 確認ポイント
- [ ] アプリ起動時にAPIからデータが取得される
- [ ] LocalStorageにデータが保存される
- [ ] JSONPlaceholderのユーザーでログインできる

---

## ステップ8: ユーザー編集機能を実装

### 目標
自分のプロフィールを編集できるようにする

### 実装内容

1. `src/pages/UserEdit.tsx`を作成（段階的に）：

```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  // 自分のプロフィールでない場合は編集不可
  if (currentUser?.id !== id) {
    navigate('/users');
    return null;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    // ユーザーデータを読み込む
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === id);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // LocalStorageのデータを更新
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === id);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name: formData.name,
        email: formData.email,
      };
      localStorage.setItem('users', JSON.stringify(users));
      
      // 現在のユーザー情報も更新
      if (currentUser?.id === id) {
        localStorage.setItem('currentUser', JSON.stringify({
          id: currentUser.id,
          name: formData.name,
          email: formData.email,
        }));
      }
      
      navigate('/users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">名前</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">メールアドレス</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          保存
        </button>
      </form>
    </div>
  );
}
```

2. ルーティングを追加：

```tsx
<Route
  path="/users/:id/edit"
  element={
    <ProtectedRoute>
      <UserEdit />
    </ProtectedRoute>
  }
/>
```

3. ユーザー一覧ページに編集ボタンを追加：

```tsx
// UserList.tsx内
const { user: currentUser } = useAuth();

// ユーザーリストの表示部分
{currentUser?.id === user.id && (
  <button
    onClick={() => navigate(`/users/${user.id}/edit`)}
    className="text-indigo-600 hover:text-indigo-900"
  >
    編集
  </button>
)}
```

### 確認ポイント
- [ ] 自分のプロフィールのみ編集ボタンが表示される
- [ ] 編集ページで情報を変更できる
- [ ] 保存すると変更が反映される

---

## 🎉 完成！

これで基本的な機能がすべて実装できました！

### 次のステップ
- エラーハンドリングの改善
- ローディング状態の表示
- バリデーションの強化
- UI/UXの改善

頑張ってください！🚀

