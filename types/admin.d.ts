export interface Admin {
  adminId: number;
  nom: string;
  password: string;
  email: string;
  contact: string;
  createdAt: string; // DateTime renvoyé par l’API -> string en JSON
}
