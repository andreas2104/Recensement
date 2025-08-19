import { Fokontany } from "@prisma/client";

export interface Personne {
  personneId: number;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: Date | string;
  lieuDeNaissance: string;
  CIN: string;
  delivree: Date | string;
  lieuDelivree: string;
  asa: string;
  nomPere: string;
  nomMere: string;
  fonenanaAnkehitriny: string;
  fonenanaTaloha: string;
  zompirenena: string;
  contact: string;
  createdAt: Date | string;
  fokontanyId: number;
  fokontany: Fokontany;
}