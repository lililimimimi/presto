import React, { useState,useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { getStore, updateStore } from "../api/data";
import Typography from "@mui/material/Typography";

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

const PresentationModal = ({
  open,
  onClose,
  onSuccess,
  initialData = null, 
  mode = "create",
}) => {


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

    useEffect(() => {
      if (initialData && mode === "edit") {
        setTitle(initialData.Title || "");
        setDescription(initialData.description || "");
      }
    }, [initialData, mode]);

  const handleCreatePresentation = async (title, description) => {
    try {
      const data = await getStore();
      const { store } = data;

      if(mode === 'create'){
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
         return await updateStore(updatedStore);
      }else{
         const updatedStore = {
          store: {
            ...store,
            [initialData.id]: {
              ...store[initialData.id],
              Title: title,
              description: description || "",
            },
          },
        };
        return await updateStore(updatedStore);
      }
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
      await handleCreatePresentation(title, description);
      setTitle("");
      setDescription("");
      onClose();
      onSuccess?.();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={onClose}
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
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              {mode === "create" ? "Create" : "Save"}
            </Button>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default PresentationModal;
