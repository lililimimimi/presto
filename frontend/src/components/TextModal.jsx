import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";

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

const TextModal = ({
  onSubmit, // Callback function to handle form submission
  initialData = null, // Initial data for editing mode
  onClose, // Callback to handle modal close
}) => {
  const [open, setOpen] = useState(Boolean(initialData));
  const handleOpen = () => setOpen(true);
  const [size, setSize] = useState(initialData?.size || "");
  const [text, setText] = useState(initialData?.text || "");
  const [fontSize, setFontSize] = useState(initialData?.fontSize || "");
  const [color, setColor] = useState(initialData?.color || "");

  const handleClose = () => {
    setOpen(false);
    // Reset form inputs if creating a new text box
    if (!initialData) {
      setSize("");
      setText("");
      setFontSize("");
      setColor("");
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = () => {
    const textBox = {
      type: "text",
      size,
      text,
      fontSize,
      color,
      position: initialData?.position || { x: 0, y: 0 },
    };
    console.log("Submitting textBox:", textBox);
    onSubmit(textBox);
    handleClose();

    if (!initialData) {
      setSize("");
      setText("");
      setFontSize("");
      setColor("");
    }
  };

  return (
    <Box>
      {!initialData && (
        <Button onClick={handleOpen}>
          <FormatColorTextIcon />
        </Button>
      )}
      <Modal
        open={initialData ? true : open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <TextField
              id="size"
              label="Size"
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setSize(e.target.value)}
              value={size}
            />
            <TextField
              id="text"
              label="Text"
              variant="outlined"
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <TextField
              id="Font-size"
              label="Font Size"
              variant="outlined"
              margin="normal"
              fullWidth
              type="number"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setFontSize(e.target.value)}
              value={fontSize}
            />
            <TextField
              id="colour"
              label="Colour"
              variant="outlined"
              type="color"
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setColor(e.target.value)}
              value={color}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="contained" onClick={handleSubmit} fullWidth>
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
export default TextModal;
