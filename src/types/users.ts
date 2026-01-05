// ユーザーの基本型（パスワードを含む）
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  username?: string;
};

// パスワードを除外したユーザー型（表示用）
export type UserWithoutPassword = Omit<User, 'password'>;

// ログイン中のユーザー型
export type CurrentUser = UserWithoutPassword;

// APIから取得するユーザー型（JSONPlaceholder用）
export type ApiUser = {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

