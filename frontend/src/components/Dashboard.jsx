import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import PresentationModal from "./PresentationModal";
import { getStore } from "../api/data";
import { Box, Button } from "@mui/material";

const Dashboard = () => {
  const [presentation, setPresentation] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button variant="text" onClick={() => setModalOpen(true)}>
          Create new presentation
        </Button>
      </Box>
      <PresentationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refreshPresentations();
          setModalOpen(false);
        }}
        mode="create"
      />

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
};

export default Dashboard;
