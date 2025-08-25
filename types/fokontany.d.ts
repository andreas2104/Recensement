export interface Fokontany {
  fokontanyId: number;
  codeFokontany: string;
  nom: string;
  createdAt: Date  | string;
  personneCount?: number;
}

export interface GetPersonneInFokontany {
  fokontanyId: number;
  codeFokontany: string;
  nom: string;
  createdAt: Date;
  personne?: {
    personneId: number;
    nom: string;
    prenom: string;
    sexe: string;
    dateNaissance: Date;
    lieuDeNaissance: string;
    CIN: string;
    delivree: Date;
    lieuDelivree: string;
    asa: string;
    fonenanaAnkehitriny: string;
    fonenanaTaloha: string;
    zompirenena: string;
    contact: string;
    createdAt: Date;
    fokontanyId: number;
  }[];
}