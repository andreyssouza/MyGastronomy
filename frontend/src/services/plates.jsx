import { useState } from "react";

export default function plateServices() {
  const [platesLoading, setPlatesLoading] = useState(false);
  const [refetchPlates, setRefetchPlates] = useState(true);
  const [platesList, setPlatesList] = useState([]);

  const url = "http://localhost:3000/plates";

  const getAvailablesPlates = (userId) => {
    setPlatesLoading(true);

    fetch(`${url}/availables/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setPlatesList(result.body);
        } else {
          console.log(result);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPlatesLoading(false);
        setRefetchPlates(false);
      });
  };

  return { getAvailablesPlates, platesLoading, refetchPlates, platesList };
}
