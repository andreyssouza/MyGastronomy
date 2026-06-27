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
      {/* Adicionamos a classe pageContainer para centralizar o bloco todo na tela */}
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Nossos Pratos</h1>

        {/* Criamos este container PAI que vai ditar as regras do Grid */}
        <div className={styles.platesGrid}>
          {platesList.map((plate) => (
            <div
              key={plate._id}
              className={styles.cardWrapper} /* Mudamos o nome para wrapper para não confundir com o card interno */
              onClick={() => {
                handlePlateSelected(plate);
              }}
            >
              <PlateCard plateData={plate} />
            </div>
          ))}
        </div>
      </div>

      <div>{plateSelected && <PlatePopup plateData={plateSelected} onClose={handleClosePopup} onAddToCart={handleAddToCart} />}</div>
    </>
  );
}
