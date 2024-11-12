import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import BasicModal from "./Modal";
import { getStore } from "../api/data";

const Dashboard =()=>{
    const [presentation, setPresentation] = useState([]);

  const getPresentations = async () => {
    try {
      const data = await getStore();
      if (data && data.store) {
        const presentationArray = Object.entries(data.store).map(
          ([id, details]) => ({
            id,
            ...details,
          })
        );
        setPresentation(presentationArray);
      }
    } catch (error) {
      console.error("Error fetching presentations:", error);
    }
  };

  useEffect(() => {
    getPresentations();
  }, []);

   const refreshPresentations = () => {
     getPresentations();
   };

    return (
      <>
        <BasicModal onCreateSuccess={refreshPresentations} />
        {presentation.map((item, index) => (
          <MediaCard
            key={item.id}
            id={item.id}
            title={item.Title}
            description={item.description}
          />
        ))}
      </>
    );
}

export default Dashboard;