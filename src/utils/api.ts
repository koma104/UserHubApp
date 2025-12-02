// JSONPlaceholder APIからユーザーデータを取得
export interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

// LocalStorage用のユーザー型（パスワードを追加）
export interface LocalStorageUser {
  id: string
  name: string
  username: string
  email: string
  password: string // デフォルトパスワード
  address?: JsonPlaceholderUser['address']
  phone?: string
  website?: string
  company?: JsonPlaceholderUser['company']
}

/**
 * JSONPlaceholder APIからユーザーデータを取得
 */
export async function fetchUsersFromAPI(): Promise<JsonPlaceholderUser[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/')
    if (!response.ok) {
      throw new Error('ユーザーデータの取得に失敗しました')
    }
    const users = await response.json()
    return users
  } catch (error) {
    console.error('APIからのユーザー取得エラー:', error)
    throw error
  }
}

/**
 * JSONPlaceholderのユーザーデータをLocalStorage用の形式に変換
 * デフォルトパスワードを設定（実際のアプリでは適切な方法で管理）
 */
export function convertToLocalStorageUsers(
  apiUsers: JsonPlaceholderUser[]
): LocalStorageUser[] {
  return apiUsers.map((user) => ({
    id: user.id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    password: 'password123', // デフォルトパスワード（実際のアプリでは適切に管理）
    address: user.address,
    phone: user.phone,
    website: user.website,
    company: user.company,
  }))
}

/**
 * LocalStorageにユーザーデータを保存（既存データがある場合は上書きしない）
 */
export function saveUsersToLocalStorage(users: LocalStorageUser[]): void {
  const existingUsers = localStorage.getItem('users')
  
  // 既にデータがある場合は、APIから取得したデータで更新（初回のみ）
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('usersInitialized', 'true')
  }
}

/**
 * APIからユーザーデータを取得してLocalStorageに保存
 */
export async function initializeUsersFromAPI(): Promise<void> {
  try {
    // 既に初期化済みの場合はスキップ
    if (localStorage.getItem('usersInitialized') === 'true') {
      return
    }

    const apiUsers = await fetchUsersFromAPI()
    const localStorageUsers = convertToLocalStorageUsers(apiUsers)
    saveUsersToLocalStorage(localStorageUsers)
  } catch (error) {
    console.error('ユーザーデータの初期化に失敗しました:', error)
    // エラーが発生してもアプリは動作するようにする
  }
}

