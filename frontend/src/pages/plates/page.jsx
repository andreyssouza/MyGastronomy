import plateServices from "../../services/plates";
import { useEffect } from "react";
import Loading from "../loading/page";
import PlateCard from "../../components/platesCard/platesCard";

export default function Plates() {
  const { getAvailablesPlates, platesLoading, platesList, refetchPlates } = plateServices();

  useEffect(() => {
    if (refetchPlates) {
      getAvailablesPlates();
    }
  }, [refetchPlates]);

  if (platesLoading) {
    return <Loading />;
  }

  console.log(platesList);

  return (
    <>
      <div>
        {platesList.map((plate) => (
          <PlateCard plateData={plate} key={plate._id} />
        ))}
      </div>
    </>
  );
}
