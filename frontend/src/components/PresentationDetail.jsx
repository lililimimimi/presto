import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore, updateStore } from "../api/data";
import ErrorModal from "./ErrorModal";
import PresentationModal from "./PresentationModal";
import { Box, keyframes } from "@mui/material";


const PresentationDetail = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [currentIndex, setCurrentIndex] = useState(1);
  const[sliedeCount, setSlideCount] = useState(1);
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
        const slides = Object.keys(presentationDetail).filter(
          (key) => !isNaN(key)
        );
        setSlideCount(slides.length);
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
  const handleToPre=()=>{
    setCurrentIndex(pre=>(pre > 1 ? pre -1 : pre));
  }

  const handleToNext =()=> {
    setCurrentIndex(pre => (pre < sliedeCount ? pre +1 : pre));
  }

  useEffect(()=>{
    const keydown =(e) =>{
        if(e.key === 'ArrayLeft'){
            handleToPre();
        }else if (e.key === "ArrayRight") {
          handleToNext();
        }
    }
    window.addEventListener('keydown',keydown)
   return () => [window.removeEventListener("keydown", keydown)];
  },[currentIndex,sliedeCount])

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
      <Button variant="contained" >
        Create
      </Button>
      <Typography gutterBottom variant="h5" component="div">
        Title: {presentation?.Title || "Loading..."}
      </Typography>
      <Typography variant="body1" component="div">
        {presentation.description}
      </Typography>
      <Box
        style={{ width: "100%", height: "500px", border: "1px solid black" }}
      ></Box>
      <Typography gutterBottom variant="h5" component="div">
        {currentIndex}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleToPre}
          disabled={currentIndex === 1}
          sx={{
            minWidth: "120px",
            height: "40px",
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleToNext}
          disabled={currentIndex === sliedeCount}
          sx={{
            minWidth: "120px",
            height: "40px",
          }}
        >
          Next
        </Button>
      </Box>

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
