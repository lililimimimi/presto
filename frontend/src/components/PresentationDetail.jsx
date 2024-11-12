import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore, updateStore } from "../api/data";
import ErrorModal from "./ErrorModal";
import PresentationModal from "./PresentationModal";

const PresentationDetail = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const { id } = useParams();


  const handleDeleteClick = () => {
    setShowDeleteModal(true); 
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
        setShowDeleteModal(false); 
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
      <Button variant="contained" onClick={() => setShowEditModal(true)}>
        Edit
      </Button>
      <Typography gutterBottom variant="h5" component="div">
        {presentation?.Title || "Loading..."}
      </Typography>
      <Typography variant="body1" component="div">
        {presentation?.description || "No description available"}
      </Typography>
      <ErrorModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePresentation}
        title="Delete Presentation"
        content="This presentation will be permanently deleted. Continue?"
      />
      <PresentationModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          getPresentationDetail();
          setShowEditModal(false);
        }}
        mode="edit"
        initialData={presentation}
      />
    </>
  );
};

export default PresentationDetail;
