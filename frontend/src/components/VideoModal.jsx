import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

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

const VideoModal = ({ onSubmit, initialData = null, onClose }) => {
  const [open, setOpen] = useState(Boolean(initialData));
  const [size, setSize] = useState(initialData?.size || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [autoplay, setAutoplay] = useState(initialData?.autoplay || false);

  const handleClose = () => {
    setOpen(false);
       if (onClose) {
      onClose();
       }
    }

  const handleSubmit = () => {
    const videoData = {
      type: "video",
      size,
      url,
      autoplay,
      position: initialData?.position || { x: 0, y: 0 },
    };
    onSubmit(videoData);
    handleClose();
  };

  return (
    <Box>
      {!initialData && <Button onClick={() => setOpen(true)}>Create a Video</Button>}
      <Modal
        open={initialData ? true : open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="size"
            label="Video Size"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setSize(e.target.value)}
            value={size}
          />
          <TextField
            id="url"
            label="Video URL"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
              />
            }
            label="Autoplay"
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
              {initialData ? "Update Video" : "Add Video"}
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

export default VideoModal;
