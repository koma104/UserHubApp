# UserHub App 学習ガイド

React初学者向けの段階的な学習プランです。このガイドに沿って、1つずつ機能を理解しながら実装していきましょう。

## 📚 学習の進め方

各ステップを順番に進めてください。各ステップでは：
1. **概念を理解する** - そのステップで学ぶReactの概念を確認
2. **小さなサンプルを作る** - 簡単な例で試してみる
3. **実際のコードを実装する** - UserHub Appに組み込む
4. **動作確認する** - 正しく動くか確認

---

## ステップ1: Reactの基本 - コンポーネントとJSX

### 学ぶこと
- 関数コンポーネント
- JSXの書き方
- propsの受け渡し

### 実践タスク
1. シンプルなHello Worldコンポーネントを作成
2. propsを使って名前を表示するコンポーネントを作成

### 例
```tsx
// src/components/Hello.tsx
function Hello({ name }: { name: string }) {
  return <h1>こんにちは、{name}さん！</h1>;
}
```

### 次のステップへ
- コンポーネントが理解できたら、ステップ2へ

---

## ステップ2: 状態管理 - useState

### 学ぶこと
- `useState`フック
- 状態の更新方法
- イベントハンドリング

### 実践タスク
1. カウンターアプリを作成（+/-ボタンで数値を増減）
2. 入力フィールドの値を表示するコンポーネント

### 例
```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### 次のステップへ
- useStateが理解できたら、ステップ3へ

---

## ステップ3: フォーム処理

### 学ぶこと
- フォームの制御（controlled components）
- `onSubmit`イベント
- `preventDefault()`

### 実践タスク
1. 名前とメールアドレスを入力するフォームを作成
2. 送信ボタンで入力値をアラート表示

### 例
```tsx
import { useState } from 'react';

function SimpleForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`名前: ${name}, メール: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メール"
      />
      <button type="submit">送信</button>
    </form>
  );
}
```

### 次のステップへ
- フォーム処理が理解できたら、ステップ4へ

---

## ステップ4: LocalStorageの使い方

### 学ぶこと
- `localStorage.setItem()` - データを保存
- `localStorage.getItem()` - データを取得
- `localStorage.removeItem()` - データを削除
- JSONのシリアライズ/デシリアライズ

### 実践タスク
1. 入力したテキストをLocalStorageに保存
2. ページをリロードしてもテキストが残るようにする

### 例
```tsx
import { useState, useEffect } from 'react';

function LocalStorageExample() {
  const [text, setText] = useState('');

  // ページ読み込み時にLocalStorageから取得
  useEffect(() => {
    const saved = localStorage.getItem('myText');
    if (saved) {
      setText(saved);
    }
  }, []);

  // テキストが変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('myText', text);
  }, [text]);

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="入力してください"
    />
  );
}
```

### 次のステップへ
- LocalStorageが理解できたら、ステップ5へ

---

## ステップ5: React Routerの基本

### 学ぶこと
- `BrowserRouter`
- `Routes`と`Route`
- `Link`と`Navigate`
- `useNavigate`フック

### 実践タスク
1. 2つのページ（Home, About）を作成
2. ナビゲーションリンクを追加

### 例
```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>ホームページ</h1>;
}

function About() {
  return <h1>Aboutページ</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 次のステップへ
- React Routerが理解できたら、ステップ6へ

---

## ステップ6: Context API（認証機能）

### 学ぶこと
- `createContext`
- `Context.Provider`
- `useContext`フック
- カスタムフックの作成

### 実践タスク
1. シンプルなテーマ切り替え（ダークモード/ライトモード）を作成
2. 認証コンテキストを作成（ログイン状態を管理）

### 例
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Contextを作成
const AuthContext = createContext<{
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
} | undefined>(undefined);

// 2. Providerコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (name: string) => {
    setUser(name);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. カスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 使用例
function LoginButton() {
  const { login } = useAuth();
  return <button onClick={() => login('太郎')}>ログイン</button>;
}

function UserInfo() {
  const { user, logout } = useAuth();
  if (!user) return <p>ログインしていません</p>;
  return (
    <div>
      <p>こんにちは、{user}さん</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
```

### 次のステップへ
- Context APIが理解できたら、ステップ7へ

---

## ステップ7: API連携（fetch）

### 学ぶこと
- `fetch` API
- `async/await`
- エラーハンドリング
- ローディング状態の管理

### 実践タスク
1. JSONPlaceholder APIからユーザーリストを取得して表示
2. ローディング中とエラー時の表示を追加

### 例
```tsx
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users/');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

### 次のステップへ
- API連携が理解できたら、ステップ8へ

---

## ステップ8: 保護されたルート

### 学ぶこと
- 条件付きレンダリング
- `Navigate`コンポーネント
- 認証状態に基づくルーティング

### 実践タスク
1. ログインしていない場合はログインページにリダイレクト
2. ログインしている場合のみアクセス可能なページを作成

### 例
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

// 使用例
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🎯 UserHub Appの実装順序

上記のステップを理解したら、以下の順序でUserHub Appを実装しましょう：

### フェーズ1: 基本構造
1. ✅ プロジェクトセットアップ（完了）
2. シンプルなログインページ（フォームのみ、まだ機能しない）
3. ユーザー一覧ページ（ハードコードされたデータを表示）

### フェーズ2: LocalStorage連携
4. LocalStorageにユーザーデータを保存
5. LocalStorageからユーザーデータを読み込み
6. ログイン機能を実装（LocalStorageのデータで認証）

### フェーズ3: ルーティング
7. React Routerを設定
8. ログインページとユーザー一覧ページをルーティング
9. 保護されたルートを実装

### フェーズ4: Context API
10. AuthContextを作成
11. ログイン状態をContextで管理
12. 各ページでuseAuthを使用

### フェーズ5: API連携
13. JSONPlaceholder APIからデータを取得
14. 取得したデータをLocalStorageに保存
15. アプリ起動時に自動取得

### フェーズ6: 編集機能
16. ユーザー編集ページを作成
17. 自分のプロフィールのみ編集可能にする
18. 編集内容をLocalStorageに保存

---

## 📖 学習リソース

### 公式ドキュメント
- [React公式ドキュメント（日本語）](https://ja.react.dev/)
- [React Router公式ドキュメント](https://reactrouter.com/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/ja/)

### おすすめの学習方法
1. **公式ドキュメントのチュートリアル**を一通り読む
2. **小さなサンプル**を作って試す
3. **実際のプロジェクト**で使ってみる
4. **エラーが出たら**エラーメッセージを読んで調べる

---

## 💡 実装のヒント

### デバッグのコツ
- `console.log()`を使って変数の値を確認
- React DevToolsを使ってコンポーネントの状態を確認
- ブラウザの開発者ツールでLocalStorageの中身を確認

### よくあるエラーと対処法
1. **"Cannot read property of undefined"**
   - オプショナルチェーン（`?.`）を使う
   - デフォルト値を設定する

2. **"Maximum update depth exceeded"**
   - useEffectの依存配列を確認
   - 無限ループが発生していないか確認

3. **"useState is not defined"**
   - import文を確認
   - `import { useState } from 'react'`を追加

---

## 🚀 次のステップ

各ステップを完了したら、以下のような機能追加に挑戦してみましょう：

- [ ] パスワードのバリデーション強化
- [ ] ローディングアニメーション
- [ ] エラーメッセージの改善
- [ ] レスポンシブデザインの調整
- [ ] ユニットテストの追加

---

## ❓ 困ったときは

1. **エラーメッセージを読む** - エラーメッセージには解決のヒントが書かれています
2. **公式ドキュメントを確認** - 公式ドキュメントが最も正確な情報源です
3. **小さく試す** - 問題を切り分けて、小さなサンプルで試してみる
4. **コミュニティに質問** - Stack OverflowやDiscordコミュニティで質問する

頑張ってください！🎉

