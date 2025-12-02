# UserHub App

ユーザー管理アプリケーション（ポートフォリオプロジェクト）

## 概要

UserHub App は、ユーザーのログイン、一覧表示、編集・保存機能を提供する Web アプリケーションです。
現在は LocalStorage を使用してデータを保存していますが、将来的に Supabase への移行を予定しています。

## 機能

- 🔐 **ログイン機能**: JSONPlaceholder のユーザーでログイン（デフォルトパスワード: `password123`）
- 📥 **データ取得**: アプリ起動時に JSONPlaceholder API からユーザーデータを自動取得
- 💾 **LocalStorage 保存**: 取得したユーザーデータを LocalStorage に保存
- 👥 **ユーザー一覧**: 登録されている全ユーザーの表示
- ✏️ **プロフィール編集**: 自分のプロフィールのみ編集可能

## 技術スタック

- **フレームワーク**: React 18
- **言語**: TypeScript
- **ビルドツール**: Vite
- **ルーティング**: React Router v6
- **スタイリング**: Tailwind CSS
- **データストレージ**: LocalStorage（現在）→ Supabase（予定）

## セットアップ

### 必要な環境

- Node.js 18 以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 使い方

1. 開発サーバーを起動すると、ブラウザで `http://localhost:5173` が開きます
2. アプリ起動時に、JSONPlaceholder API からユーザーデータが自動的に取得され、LocalStorage に保存されます
3. ログインページで、JSONPlaceholder のユーザーのメールアドレスとデフォルトパスワード（`password123`）を入力してログインします
   - 例: `Sincere@april.biz` / `password123`
4. ログイン後、ユーザー一覧ページで全ユーザーを閲覧できます
5. 「自分のプロフィールを編集」ボタンから、自分のプロフィールのみ編集できます

## プロジェクト構造

```
userhub-app/
├── src/
│   ├── contexts/       # 認証コンテキスト
│   ├── pages/          # ページコンポーネント
│   │   ├── Login.tsx   # ログインページ
│   │   ├── UserList.tsx # ユーザー一覧ページ
│   │   └── UserEdit.tsx # ユーザー編集ページ
│   ├── utils/          # ユーティリティ関数
│   │   └── api.ts      # JSONPlaceholder API関連
│   ├── App.tsx         # メインアプリケーション
│   ├── main.tsx        # エントリーポイント
│   └── index.css       # グローバルスタイル
├── index.html
├── package.json
└── README.md
```

## データソース

ユーザーデータは [JSONPlaceholder](https://jsonplaceholder.typicode.com/users/) から取得されます。

- 初回起動時に自動的に API からデータを取得
- LocalStorage に保存され、以降は LocalStorage のデータを使用
- 各ユーザーは自分のプロフィールのみ編集可能

## ログイン情報

JSONPlaceholder のユーザーでログインできます：

- **メールアドレス**: JSONPlaceholder のユーザーのメールアドレス（例: `Sincere@april.biz`）
- **パスワード**: `password123`（全ユーザー共通のデフォルトパスワード）

## 今後の予定

- [ ] Supabase への移行
- [ ] パスワードのハッシュ化
- [ ] バリデーションの強化
- [ ] エラーハンドリングの改善
- [ ] テストの追加

## ライセンス

このプロジェクトはポートフォリオ用のプロジェクトです。
