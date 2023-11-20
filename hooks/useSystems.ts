import { useEffect, useState } from "react";
import { SystemService } from "@services/system";
import { System } from "@common/system";

const useSystems = () => {
  const [allSystems, setAllSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>(allSystems);
  const [loading, setLoading] = useState(true);

  const searchSystem = (query: string) => {
    const searchResult = allSystems.filter(
      ({ name, description }: { name: string; description: string }) =>
        name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );

    setFilteredSystems(searchResult);
  };

  useEffect(() => {
    SystemService.getAllSystems()
      .then((systems) => {
        setAllSystems(systems as System[]);
        setFilteredSystems(systems as System[]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, systems: filteredSystems, onSearch: searchSystem };
};

export default useSystems;
