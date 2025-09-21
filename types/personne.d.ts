export type Statut = "ACTIF" | "DEMENAGER" | "DECEDE";

export interface Personne {
  personneId: number;
  nom: string;
  prenom: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuDeNaissance: string;
  CIN: string;
  dateDelivree: string;
  lieuDelivrence: string;
  profession: string;
  nomPere?: string;
  nomMere?: string;
  adresseActuelle: string;
  ancienneAdresse: string;
  nationalite: string;
  contact: string;
  statut: Statut;
  estElecteur: boolean;
  createdAt: string;
}
