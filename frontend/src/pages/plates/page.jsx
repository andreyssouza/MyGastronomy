import plateServices from "../../services/plates";
import { useEffect, useState } from "react";
import Loading from "../loading/page";
import PlateCard from "../../components/platesCard/platesCard";
import styles from "./page.module.css";
import plateSelected from "../../components/platePopup/platePopup";
import PlatePopup from "../../components/platePopup/platePopup";
import { useCartContext } from "../../contexts/useCartContext";

export default function Plates() {
  const { getAvailablesPlates, platesLoading, platesList, refetchPlates } = plateServices();
  const [plateSelected, setPlateSelected] = useState(null);
  const { addToCart } = useCartContext();

  useEffect(() => {
    if (refetchPlates) {
      getAvailablesPlates();
    }
  }, [refetchPlates]);

  const handlePlateSelected = (plate) => {
    setPlateSelected(plate);
  };

  const handleClosePopup = () => {
    setPlateSelected(null);
  };

  const handleAddToCart = (itemToAdd) => {
    addToCart(itemToAdd);
    handleClosePopup();
  };

  if (platesLoading) {
    return <Loading />;
  }

  console.log(platesList);

  return (
    <>
      <div>
        {platesList.map((plate) => (
          <div
            key={plate._id}
            className={styles.cardContainer}
            onClick={() => {
              handlePlateSelected(plate);
            }}
          >
            <PlateCard plateData={plate} />
          </div>
        ))}
      </div>

      <div>{plateSelected && <PlatePopup plateData={plateSelected} onClose={handleClosePopup} onAddToCart={handleAddToCart} />}</div>
    </>
  );
}
