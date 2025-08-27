// import PersonnePage from "./dashboard/personne/page";

import FokontanyGrid from "./component/ui/FokontanyGrid";

export default function Home() {
  return (
 <div>
  <div className="text-center">
    <h2 className="text-xl mb-4 py-4">Tongasoa eto aminny Pejy iero daholo ny fokontany efa voarakitra</h2>
  </div>
  <FokontanyGrid/>
 </div>
  );
}
