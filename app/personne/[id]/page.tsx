'use client';

import { useParams } from 'next/navigation';
import AfficherPersonneDetails from '@/app/components/ui/afficherPersonneDetails'

export default function PersonneDetailsPage() {
  const { id } = useParams();

  if (!id) return <div className="min-h-screen flex items-center justify-center text-gray-600">ID manquant</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AfficherPersonneDetails personneId={Number(id)} />
    </div>
  );
}