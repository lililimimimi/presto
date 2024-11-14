import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ThumbnailModal = ({
  onSubmit,
  initialData = null,
  onClose,
}) => {
  const [open, setOpen] = useState(Boolean(initialData));
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.thumbnailUrl || "");

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setThumbnailFile(null);
    setPreviewUrl(initialData?.thumbnailUrl || ""); // Reset preview to initial data if editing
    if (onClose) {
      onClose();
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const localUrl = URL.createObjectURL(file); // Generate a local preview URL
      setPreviewUrl(localUrl);
    }
  };

  const handleSubmit = () => {
    if (thumbnailFile) {
      const reader = new FileReader(); // Create a FileReader to read the file as data URL
      reader.onloadend = () => {
        const thumbnailData = {
          type: "thumbnail",
          thumbnailUrl: reader.result, // Base64 URL of the image
        };
        onSubmit(thumbnailData);
        handleClose();
      };
      reader.readAsDataURL(thumbnailFile);
    }
  };

  return (
    <Box>
      {/* Button to open modal if creating a new thumbnail */}
      {!initialData && <Button onClick={handleOpen}>Edit Thumbnail</Button>}

      {/* Modal for editing or adding a thumbnail */}
      <Modal
        open={initialData ? true : open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <TextField
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            {/* Display thumbnail preview if a file is selected */}
            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
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
          </Box>
          {/* Action buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!thumbnailFile && !initialData}
              fullWidth
            >
              {initialData ? "Update" : "Add"}
            </Button>
            <Button variant="outlined" onClick={handleClose} fullWidth>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ThumbnailModal;
