export interface ClientUser {
  id: number;
  client_id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface ClientSession {
  id: number;
  client_user_id: number;
  token: string;
  created_at: string;
  expires_at: string;
}
