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
    setPreviewUrl(initialData?.thumbnailUrl || "");
    if (onClose) {
      onClose();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const handleSubmit = () => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const thumbnailData = {
          type: "thumbnail",
          thumbnailUrl: reader.result,
        };
        onSubmit(thumbnailData);
        handleClose();
      };
      reader.readAsDataURL(thumbnailFile);
    }
  };

  return (
    <Box>
      {!initialData && <Button onClick={handleOpen}>Edit Thumbnail</Button>}
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!thumbnailFile && !initialData}
            >
              {initialData ? "Update" : "Add"}
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ThumbnailModal;
