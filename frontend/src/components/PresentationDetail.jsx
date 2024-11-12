import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore, updateStore } from "../api/data";
import ErrorModal from "./ErrorModal";

const PresentationDetail = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const { id } = useParams();


  const handleDeleteClick = () => {
    setShowModal(true); 
  };

  const getPresentationDetail = async () => {
     setLoading(true);
    try {
      const data = await getStore();
      if (data && data.store) {
        const presentationDetail = data.store[id]; 
        if (presentationDetail) {
          setPresentation({ id, ...presentationDetail });
        } else {
          console.error("Presentation not found");
        }
      }
    } catch (error) {
      console.error("Error fetching presentations:", error);
    }
  };
  useEffect(()=>{
    getPresentationDetail();
  },[id])

  const handleDeletePresentation = async () => {
      try {
        const data = await getStore();

        const updatedStore = {
          store: { ...data.store },
        };
        delete updatedStore.store[id];

        await updateStore(updatedStore);
        setShowModal(false); 
         navigate("/dashboard");

      } catch (error) {
        setError("Failed to delete presentation");
      }
    
  };

  return (
    <>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back
      </Button>
      <Button variant="contained" onClick={handleDeleteClick}>
        Delete
      </Button>
      <Typography gutterBottom variant="h5" component="div">
        {presentation?.Title || "Loading..."}
      </Typography>
      <Typography variant="body1" component="div">
        {presentation?.description || "No description available"}
      </Typography>
      <ErrorModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeletePresentation}
        title="Delete Presentation"
        content="This presentation will be permanently deleted. Continue?"
      />
    </>
  );
};

export default PresentationDetail;
