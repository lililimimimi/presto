import React, { useEffect, useState, useRef } from "react";
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
    const [imageData, setImageData] = useState(initialData?.url || "");
    const fileInputRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
    if (!initialData) {
      setImageSize("");
      setImageAltText("");
      setImageData(""); 
    }
    if (onClose) {
      onClose();
    }
  };


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

    const extractImageUrl = (googleUrl) => {
      try {
        const url = new URL(googleUrl);
        if (url.hostname === "www.google.com" && url.pathname === "/imgres") {
          const imgUrl = url.searchParams.get("imgurl");
          if (imgUrl) {
            return decodeURIComponent(imgUrl);
          }
        }
        return googleUrl;
      } catch (e) {
        return googleUrl;
      }
    };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    const imageUrl = extractImageUrl(inputUrl);
    setImageData(imageUrl);
  };

  const handleSubmit = () => {
    const imageBox = {
      type: "image",
      size: imageSize,
      altText: imageAltText,
      url: imageData,
      position: initialData?.position || { x: 0, y: 0 },
    };
    console.log("Submitting imageBox:", imageBox);
    onSubmit(imageBox);
    handleClose();

    if (!initialData) {
      setImageSize("");
      setImageAltText("");
      setImageData(""); 
    }
  };

  return (
    <Box>
      {!initialData && (
        <Button onClick={handleOpen}>Create an image box</Button>
      )}
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
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setImageSize(e.target.value)}
            value={imageSize}
          />
          <TextField
            id="Font-size"
            label="Alt text"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            fullWidth
            onChange={(e) => setImageAltText(e.target.value)}
            value={imageAltText}
          />
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={handleUrlChange}
            value={imageData}
            placeholder="https://example.com/image.jpg"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileSelect}
          />
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
              onClick={() => fileInputRef.current.click()}
            >
              Upload Image
            </Button>
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
