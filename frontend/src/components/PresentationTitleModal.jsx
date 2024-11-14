import React, { useState,useEffect } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { getStore, updateStore } from "../api/data";
import {
  Box,
  Stack,
} from "@mui/material"; 

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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (initialData && mode === "edit") {
      setTitle(initialData.Title || "");
      setDescription(initialData.description || "");
      setPreviewUrl(initialData.thumbnailUrl || "");
    }
  }, [initialData, mode]);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const localUrl = URL.createObjectURL(file); // Generate a local preview URL
      setPreviewUrl(localUrl);
    }
  };

  // Function to handle creating or editing a presentation
const handleSubmit = async () => {
  if (!title.trim()) {
    alert("Please enter a title");
    return;
  }

  try {
    const data = await getStore();
    const { store } = data;

    let thumbnailUrl = previewUrl;
    if (thumbnailFile) {
      const reader = new FileReader();
      thumbnailUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(thumbnailFile);
      });
    }

    if (mode === "create") {
      const timestamp = Date.now();
      const newId = `${timestamp}`;
      const updatedStore = {
        store: {
          ...store,
          [newId]: {
            1: {},
            Title: title,
            description: description || "",
            thumbnailUrl,
          },
        },
      };
      await updateStore(updatedStore);
    } else {
      const updatedStore = {
        store: {
          ...store,
          [initialData.id]: {
            ...store[initialData.id],
            Title: title,
            description: description || "",
            thumbnailUrl,
          },
        },
      };
      await updateStore(updatedStore);
    }

    setTitle("");
    setDescription("");
    setThumbnailFile(null);
    setPreviewUrl("");
    onClose();
    onSuccess?.();
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Presentation Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description (Optional)"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {previewUrl && (
            <Box sx={{ textAlign: "center" }}>
              <img
                src={previewUrl}
                alt="Thumbnail preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              {mode === "create" ? "Create" : "Save"}
            </Button>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};
export default PresentationModal;
