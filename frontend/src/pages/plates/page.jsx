import plateServices from "../../services/plates";
import { useEffect } from "react";
import Loading from "../loading/page";

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

  return <h1>Plates</h1>;
}
