import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { getStore,updateStore } from "../api/data";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({onCreateSuccess}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = useState('');
  const [description,setDescription] = useState('');

  const handleCreatePresentation = async (title, description) => {
    try {
      const data = await getStore();
      const { store } = data;

      const timestamp = Date.now();
      const newId = `${timestamp}`;

      const updatedStore = {
        store: {
          ...store,
          [newId]: {
            1: {},
            Title: title,
            description: description || "",
          },
        },
      };
      const updatedData = await updateStore(updatedStore);
      console.log("Presentation created successfully:", updatedData);
      return updatedData;
    } catch (error) {
      console.error("Failed to create presentation:", error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    try {
      await handleCreatePresentation(title,description);
      setTitle("");
      setDescription(""); 
      handleClose();
      onCreateSuccess?.(); 
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onClick={handleOpen}>Create new presentation</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Presentation Title"
            variant="outlined"
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <TextField
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
