'use client';

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFokontany } from "@/hooks/useFokontany";
// import { addPersonne, updatePersonne } from "@/services/personneService";
import { usePersonne } from "@/hooks/usePersonne";

type Sexe = 'M' | 'F';
type Personne = {
  personneId?: number;
  nom: string;
  prenom: string;
  sexe: Sexe | '';
  dateNaissance: Date | undefined;
  lieuDeNaissance: string;
  CIN: string;
  delivree: Date | undefined;
  lieuDelivree: string;
  asa: string;
  nomPere: string;
  nomMere: string;
  fonenanaAnkehitriny: string;
  fonenanaTaloha: string;
  zompirenena: string;
  contact: string;
  nomFokontany: string;
};
type FormData = Omit<Personne, 'personneId'>;

const formatCIN = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  // groupes de 3
  return numbers.replace(/(.{3})(?=.)/g, '$1 ').trim();
};

const formatContact = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5)}`;
  return `${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 10)}`;
};

export default function InputPersonneModal({
  personne,
  onClose,
}: {
  personne: Personne | null;
  onClose: (personne?: Personne) => void;
}) {
  const { addPersonne, updatePersonne } = usePersonne();
  const { fokontany, isPending: isFokontanyPending, error: fokontanyError } = useFokontany();

  const [formData, setFormData] = useState<FormData>({
    nom: personne?.nom ?? '',
    prenom: personne?.prenom ?? '',
    sexe: (personne?.sexe as Sexe) ?? '',
    dateNaissance: personne?.dateNaissance ? new Date(personne.dateNaissance) : undefined,
    lieuDeNaissance: personne?.lieuDeNaissance ?? '',
    CIN: personne?.CIN ? formatCIN(personne.CIN) : '',
    delivree: personne?.delivree ? new Date(personne.delivree) : undefined,
    lieuDelivree: personne?.lieuDelivree ?? '',
    asa: personne?.asa ?? '',
    nomPere: personne?.nomPere ?? '',
    nomMere: personne?.nomMere ?? '',
    fonenanaAnkehitriny: personne?.fonenanaAnkehitriny ?? '',
    fonenanaTaloha: personne?.fonenanaTaloha ?? '',
    zompirenena: personne?.zompirenena ?? '',
    contact: personne?.contact ? formatContact(personne.contact) : '',
    nomFokontany: personne?.nomFokontany ?? '',
  });

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (personne) {
      setFormData({
        nom: personne.nom,
        prenom: personne.prenom,
        sexe: personne.sexe as Sexe,
        dateNaissance: personne.dateNaissance ? new Date(personne.dateNaissance) : undefined,
        lieuDeNaissance: personne.lieuDeNaissance,
        CIN: formatCIN(personne.CIN),
        delivree: personne.delivree ? new Date(personne.delivree) : undefined,
        lieuDelivree: personne.lieuDelivree,
        asa: personne.asa,
        nomPere: personne.nomPere,
        nomMere: personne.nomMere,
        fonenanaAnkehitriny: personne.fonenanaAnkehitriny,
        fonenanaTaloha: personne.fonenanaTaloha,
        zompirenena: personne.zompirenena,
        contact: formatContact(personne.contact),
        nomFokontany: personne.nomFokontany ?? '',
      });
    }
  }, [personne]);

  // Gère inputs + formatage CIN/contact + conversion pour nomFokontany
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'nomFokontany') {
      setFormData((prev) => ({ ...prev, nomFokontany: value }));
      return;
    }

    let formattedValue = value;
    if (name === 'CIN') formattedValue = formatCIN(value);
    if (name === 'contact') formattedValue = formatContact(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleDateChange = (key: 'dateNaissance' | 'delivree', date: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: date ?? undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!formData.nomFokontany) {
      setMessage("Veuillez sélectionner un fokontany.");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        dateNaissance: formData.dateNaissance?.toISOString(),
        delivree: formData.delivree?.toISOString(),
        CIN: formData.CIN.replace(/\s/g, ''),
        contact: formData.contact.replace(/\s/g, ''),
      };

      let result: Personne;
      if (personne?.personneId) {
        result = await updatePersonne({ ...dataToSubmit, personneId: personne.personneId } as Personne);
      } else {
        result = await addPersonne(dataToSubmit as Personne);
      }

      setMessage("Personne ajoutée/modifiée avec succès !");
      onClose(result);
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      setMessage("Une erreur est survenue lors de la soumission: " + error.message);
    }
  };

  if (isFokontanyPending) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white text-black p-4 rounded">Chargement des fokontany…</div>
      </div>
    );
  }

  if (fokontanyError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white text-black p-4 rounded">Erreur: {String((fokontanyError as any)?.message ?? fokontanyError)}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-black shadow-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{personne ? 'Modifier une personne' : 'Ajouter une personne'}</h2>

        {message && (
          <div className="mb-4 text-center p-2 rounded-md bg-green-100 text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Nom / Prénom */}
            <div>
              <label className="block text-sm">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* Sexe */}
            <div>
              <label className="block text-sm">Sexe</label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              >
                <option value="" disabled>Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            {/* Date de Naissance (DatePicker) */}
            <div>
              <label className="block text-sm">Date de Naissance</label>
              <DatePicker
                selected={formData.dateNaissance ?? null}
                onChange={(d) => handleDateChange('dateNaissance', d)}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={200}
                minDate={new Date(1860, 0, 1)}
                maxDate={new Date()}
                withPortal
                placeholderText="Sélectionner une date"
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Lieu de naissance */}
            <div>
              <label className="block text-sm">Lieu de Naissance</label>
              <input
                type="text"
                name="lieuDeNaissance"
                value={formData.lieuDeNaissance}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* CIN (formaté) */}
            <div>
              <label className="block text-sm">CIN</label>
              <input
                type="text"
                name="CIN"
                inputMode="numeric"
                value={formData.CIN}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* Date de délivrance (DatePicker) */}
            <div>
              <label className="block text-sm">Date de délivrance</label>
              <DatePicker
                selected={formData.delivree ?? null}
                onChange={(d) => handleDateChange('delivree', d)}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={200}
                minDate={new Date(1860, 0, 1)}
                maxDate={new Date()}
                withPortal
                placeholderText="Sélectionner une date"
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Lieu de délivrance */}
            <div>
              <label className="block text-sm">Lieu de délivrance</label>
              <input
                type="text"
                name="lieuDelivree"
                value={formData.lieuDelivree}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm">Profession</label>
              <input
                type="text"
                name="asa"
                value={formData.asa}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Nom du Père */}
            <div>
              <label className="block text-sm">Nom du Père</label>
              <input
                type="text"
                name="nomPere"
                value={formData.nomPere}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* Nom de la Mère */}
            <div>
              <label className="block text-sm">Nom de la Mère</label>
              <input
                type="text"
                name="nomMere"
                value={formData.nomMere}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* Résidence actuelle */}
            <div>
              <label className="block text-sm">Résidence Actuelle</label>
              <input
                type="text"
                name="fonenanaAnkehitriny"
                value={formData.fonenanaAnkehitriny}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Ancienne résidence */}
            <div>
              <label className="block text-sm">Ancienne Résidence</label>
              <input
                type="text"
                name="fonenanaTaloha"
                value={formData.fonenanaTaloha}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Nationalité */}
            <div>
              <label className="block text-sm">Nationalité</label>
              <input
                type="text"
                name="zompirenena"
                value={formData.zompirenena}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            {/* Contact (formaté comme CIN) */}
            <div>
              <label className="block text-sm">Contact</label>
              <input
                type="text"
                name="contact"
                inputMode="numeric"
                value={formData.contact}
                onChange={handleChange}
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Fokontany (depuis ton hook) */}
            <div>
              <label className="block text-sm">Fokontany</label>
              <select
                name="nomFokontany"
                value={formData.nomFokontany}
                onChange={handleChange}
                className="border w-full p-2 rounded"
                required
              >
                <option value="" disabled>Sélectionner un fokontany</option>
                {fokontany?.map((f: any) => (
                  <option key={f.fokontanyId} value={f.nom}>
                    {f.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons fixes en bas */}
          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {personne ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
