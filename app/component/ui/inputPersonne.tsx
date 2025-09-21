'use client';

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePersonne } from "@/hooks/usePersonne";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Personne } from "@/types/personne";

type FormData = Omit<Personne, 'personneId' | 'estElecteur' | 'createdAt'> & {
  nomPere: string;
  nomMere: string;
};

const formatCIN = (value: string) => value.replace(/\D/g, '').slice(0, 12).replace(/(.{3})(?=.)/g, '$1 ').trim();
const formatContact = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0,3)} ${numbers.slice(3)}`;
  if (numbers.length <= 7) return `${numbers.slice(0,3)} ${numbers.slice(3,5)} ${numbers.slice(5)}`;
  return `${numbers.slice(0,3)} ${numbers.slice(3,5)} ${numbers.slice(5,7)} ${numbers.slice(7,10)}`;
};

const calculateAge = (dateNaissance: string) => {
  if (!dateNaissance) return 0;
  const today = new Date();
  const birth = new Date(dateNaissance);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

export default function InputPersonneModal({
  personne,
  onClose,
}: {
  personne: Personne | null;
  onClose: (personne?: Personne) => void;
}) {
  const { addPersonne, updatePersonne } = usePersonne();

  const [formData, setFormData] = useState<FormData>({
    nom: personne?.nom ?? '',
    prenom: personne?.prenom ?? '',
    sexe: personne?.sexe ?? 'M',
    dateNaissance: personne?.dateNaissance ?? '',
    lieuDeNaissance: personne?.lieuDeNaissance ?? '',
    CIN: personne?.CIN ?? '',
    dateDelivree: personne?.dateDelivree ?? '',
    lieuDelivrence: personne?.lieuDelivrence ?? '',
    profession: personne?.profession ?? '',
    nomPere: personne?.nomPere ?? '',
    nomMere: personne?.nomMere ?? '',
    adresseActuelle: personne?.adresseActuelle ?? '',
    ancienneAdresse: personne?.ancienneAdresse ?? '',
    nationalite: personne?.nationalite ?? '',
    contact: personne?.contact ?? '',
    statut: personne?.statut ?? 'ACTIF',
  });

  useEffect(() => {
    if (personne) {
      setFormData({
        nom: personne.nom ?? '',
        prenom: personne.prenom ?? '',
        sexe: personne.sexe ?? 'M',
        dateNaissance: personne.dateNaissance ?? '',
        lieuDeNaissance: personne.lieuDeNaissance ?? '',
        CIN: personne.CIN ?? '',
        dateDelivree: personne.dateDelivree ?? '',
        lieuDelivrence: personne.lieuDelivrence ?? '',
        profession: personne.profession ?? '',
        nomPere: personne.nomPere ?? '',
        nomMere: personne.nomMere ?? '',
        adresseActuelle: personne.adresseActuelle ?? '',
        ancienneAdresse: personne.ancienneAdresse ?? '',
        nationalite: personne.nationalite ?? '',
        contact: personne.contact ?? '',
        statut: personne.statut ?? 'ACTIF',
      });
    }
  }, [personne]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'CIN') formattedValue = formatCIN(value);
    if (name === 'contact') formattedValue = formatContact(value);
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleDateChange = (key: 'dateNaissance' | 'dateDelivree', date: Date | null) => {
    setFormData(prev => ({ ...prev, [key]: date ? date.toISOString() : '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.dateNaissance || calculateAge(formData.dateNaissance) < 18) {
      toast.error("L'âge doit être d'au moins 18 ans.");
      return;
    }

    if (formData.CIN.replace(/\s/g,'').length !== 12) {
      toast.error("Le CIN doit contenir exactement 12 chiffres.");
      return;
    }

    try {
      let result: Personne;
      if (personne?.personneId) {
        result = await updatePersonne({
          ...formData,
          personneId: personne.personneId,
          estElecteur: personne.estElecteur ?? false,
          createdAt: personne.createdAt ?? new Date().toISOString(),
        });
        toast.success("Personne modifiée avec succès !");
      } else {
        result = await addPersonne({
          ...formData,
          estElecteur: false,
          createdAt: new Date().toISOString(),
        });
        toast.success("Personne ajoutée avec succès !");
      }
      onClose(result);
    } catch (err: any) {
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const handleCancel = () => {
    toast.info("Opération annulée.");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-black shadow-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{personne ? 'Modifier une personne' : 'Ajouter une personne'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required className="border w-full p-2 rounded"/>
            <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required className="border w-full p-2 rounded"/>
            <select name="sexe" value={formData.sexe} onChange={handleChange} required className="border w-full p-2 rounded">
              <option value="" disabled>Sélectionner sexe</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>

            <DatePicker
              selected={formData.dateNaissance ? new Date(formData.dateNaissance) : null}
              onChange={(d) => handleDateChange('dateNaissance', d)}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              placeholderText="Date de naissance"
              className="border w-full p-2 rounded"
            />

            <input name="lieuDeNaissance" value={formData.lieuDeNaissance} onChange={handleChange} placeholder="Lieu de naissance" className="border w-full p-2 rounded"/>
            <input name="CIN" value={formData.CIN} onChange={handleChange} placeholder="CIN" className="border w-full p-2 rounded"/>

            <DatePicker
              selected={formData.dateDelivree ? new Date(formData.dateDelivree) : null}
              onChange={(d) => handleDateChange('dateDelivree', d)}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              scrollableYearDropdown
              placeholderText="Date de délivrance"
              className="border w-full p-2 rounded"
            />

            <input name="lieuDelivrence" value={formData.lieuDelivrence} onChange={handleChange} placeholder="Lieu délivrance" className="border w-full p-2 rounded"/>
            <input name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="border w-full p-2 rounded"/>
            <input name="nomPere" value={formData.nomPere ?? ''} onChange={handleChange} placeholder="Nom Père" className="border w-full p-2 rounded"/>
            <input name="nomMere" value={formData.nomMere ?? ''} onChange={handleChange} placeholder="Nom Mère" className="border w-full p-2 rounded"/>
            <input name="adresseActuelle" value={formData.adresseActuelle} onChange={handleChange} placeholder="Adresse actuelle" className="border w-full p-2 rounded"/>
            <input name="ancienneAdresse" value={formData.ancienneAdresse} onChange={handleChange} placeholder="Ancienne adresse" className="border w-full p-2 rounded"/>
            <input name="nationalite" value={formData.nationalite} onChange={handleChange} placeholder="Nationalité" className="border w-full p-2 rounded"/>
            <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" className="border w-full p-2 rounded"/>

            {/* Statut */}
            <select
              name="statut"
              value={formData.statut ?? 'ACTIF'}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option value="ACTIF">Actif</option>
              <option value="DEMENAGER">Déménagé</option>
              <option value="DECEDE">Décédé</option>
          </select>

          </div>

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={handleCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Annuler</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{personne ? 'Mettre à jour' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
