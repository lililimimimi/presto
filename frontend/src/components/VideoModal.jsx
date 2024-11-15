import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "80%",
    sm: 400,
  },
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
    if (!initialData) {
      setSize("");
      setUrl("");
      setAutoplay(false);
    }
    if (onClose) {
      onClose();
    }
  };

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
    if (!initialData) {
      setSize("");
      setUrl("");
      setAutoplay(false);
    }
  };

  return (
    <Box>
      {/* Button to open modal for creating new video */}
      {!initialData && (
        <Button onClick={() => setOpen(true)}>
          <OndemandVideoIcon />
        </Button>
      )}
      {/* Modal for adding or editing a video */}
      <Modal
        open={initialData ? true : open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Input fields for video properties */}
          <TextField
            id="size"
            label="Video Size"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setSize(e.target.value)}
            value={size}
          />
          <TextField
            id="url"
            label="Video URL"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
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
          {/* Action buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              {initialData ? "Update Video" : "Add Video"}
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

export default VideoModal;
