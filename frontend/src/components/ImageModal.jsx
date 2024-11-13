import React, { useEffect, useState } from "react";
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

const ImageModal = ({
  onSubmit,
  presentationId,
  initialData = null,
  onClose,
}) => {
  const [open, setOpen] = useState(Boolean(initialData));
  const handleOpen = () => setOpen(true);
  const [imageSize, setImageSize] = useState(initialData?.imageSize || "");
  const [imageAltText, setImageAltText] = useState(
    initialData?.imageAltText || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const handleClose = () => {
    setOpen(false);
    if (!initialData) {
      setImageSize("");
      setImageAltText("");
      setImageUrl("");
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = () => {
    const imageBox = {
      size: imageSize,
      altText: imageAltText,
      url: imageUrl,
      position: initialData?.position || { x: 0, y: 0 },
    };
    console.log("Submitting textBox:", imageBox);
    onSubmit(imageBox);
    handleClose();

    if (!initialData) {
      setImageSize("");
      setImageAltText("");
      setImageUrl("");
    }
  };

  return (
    <Box>
      {!initialData && <Button onClick={handleOpen}>Create a image box</Button>}
      <Modal
        open={initialData ? true : open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="size"
            label="Size"
            variant="outlined"
            fullWidth
            onChange={(e) => setImageSize(e.target.value)}
            value={imageSize}
          />
          <TextField
            id="Font-size"
            label="Alt text"
            variant="outlined"
            fullWidth
            onChange={(e) => setImageAltText(e.target.value)}
            value={imageAltText}
          />
          <TextField
            id="url"
            label="Url"
            variant="outlined"
            fullWidth
            onChange={(e) => setImageUrl(e.target.value)}
            value={imageUrl}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr", 
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              {initialData ? "Update" : "Add"}
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default ImageModal;
