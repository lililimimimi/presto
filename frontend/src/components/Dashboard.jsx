import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MediaCard from "./MediaCard";
import PresentationModal from "./PresentationTitleModal";
import { getStore } from "../api/data";
import { Box, Button } from "@mui/material";

const Dashboard = () => {
  const [presentation, setPresentation] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch presentations from the store
  const getPresentations = async () => {
    try {
      const data = await getStore();
      if (data && data.store) {
        // Transform data to include slide counts
        const presentationArray = Object.entries(data.store).map(
          ([id, presentation]) => {
            const slideCount = Object.keys(presentation).filter(
              (key) => !isNaN(key)
            ).length;
            return {
              id,
              ...presentation,
              slideCount,
            };
          }
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
  // Refresh the presentation list
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
          slideCount={item.slideCount}
          thumbnailUrl={item.thumbnailUrl}
        />
      ))}
    </>
  );
};

export default Dashboard;
