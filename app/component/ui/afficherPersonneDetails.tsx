"use client"

import { useEffect, useState } from "react";
import { Personne } from "@/types/personne";
import { getPersonneById } from "@/services/personneService"; // 👈 à créer si pas encore fait

interface Props {
  personneId: number;
}

const AfficherPersonneDetails = ({ personneId }: Props) => {
  const [personne, setPersonne] = useState<Personne | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPersonne = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPersonneById(personneId);
        setPersonne(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    getPersonne();
  }, [personneId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur: {error}</div>;
  if (!personne) return <div>Aucune personne trouvée.</div>;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">Détails de la personne</h2>
      <div><strong>Nom:</strong> {personne.nom}</div>
      <div><strong>Prénom:</strong> {personne.prenom}</div>
      <div><strong>Sexe:</strong> {personne.sexe}</div>
      <div><strong>Date de naissance:</strong> {personne.dateNaissance ? new Date(personne.dateNaissance).toLocaleDateString() : "N/A"}</div>
      <div><strong>Lieu de naissance:</strong> {personne.lieuDeNaissance}</div>
      <div><strong>CIN:</strong> {personne.CIN}</div>
      <div><strong>Date de délivrance:</strong> {personne.delivree ? new Date(personne.delivree).toLocaleDateString() : "N/A"}</div>
      <div><strong>Lieu de délivrance:</strong> {personne.lieuDelivree}</div>
      <div><strong>Profession:</strong> {personne.asa}</div>
      <div><strong>Nom Père:</strong> {personne.nomPere}</div>
      <div><strong>Nom Mère:</strong> {personne.nomMere}</div>
      <div><strong>Résidence actuelle:</strong> {personne.fonenanaAnkehitriny}</div>
      <div><strong>Ancienne résidence:</strong> {personne.fonenanaTaloha}</div>
      <div><strong>Nationalité:</strong> {personne.zompirenena}</div>
      <div><strong>Contact:</strong> {personne.contact}</div>
      <div><strong>Fokontany:</strong> {personne.fokontany?.nom ?? personne.fokontanyId}</div>
    </div>
  );
};

export default AfficherPersonneDetails;
