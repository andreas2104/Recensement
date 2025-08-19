export interface famille {
  familleId: number;
  nom: string;
  fokontanyId: number;
  createdAt: Date;
  fokontany?: {
    nom: string;
  } | null;
}