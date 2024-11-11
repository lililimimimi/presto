import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore } from "../api/data";

const PresentationDetail = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getPresentationDetail = async () => {
     setLoading(true);
    try {
      const data = await getStore();
      if (data && data.store) {
        const presentationDetail = data.store[id]; 
        console.log(presentationDetail);
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

  const handleDeletePresentation=()=>{
        const confirmModal = window.confirm('Are you sure to delete this slide ?');
        if(confirmModal ){
            const userToken = localStorage.getItem('token');
            getStore()
            .then(data=>{
                delete data.store[id]
            })
        }
  }
  return (
    <>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back
      </Button>
      <Button variant="contained" onClick={handleDeletePresentation}>
        Delete
      </Button>
      <Typography gutterBottom variant="h5" component="div">
        {presentation?.Title || "Loading..."}
      </Typography>
      <Typography variant="body1" component="div">
        {presentation?.description || "No description available"}
      </Typography>
    </>
  );
};

export default PresentationDetail;
