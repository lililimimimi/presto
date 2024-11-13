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

const SlideModal = ({
  onSubmit,
  presentationId,
  initialData = null,
  onClose,
}) => {
  const [open, setOpen] = useState(Boolean(initialData));
  const handleOpen = () => setOpen(true);
  const [size, setSize] = useState(initialData?.size || "");
  const [text, setText] = useState(initialData?.text || "");
  const [fontSize, setFontSize] = useState(initialData?.fontSize || "");
  const [color, setColor] = useState(initialData?.color || "");

  const handleClose = () => {
    setOpen(false);
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
      {!initialData && <Button onClick={handleOpen}>Create a text box</Button>}
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
            onChange={(e) => setSize(e.target.value)}
            value={size}
          />
          <TextField
            id="text"
            label="Text"
            variant="outlined"
            fullWidth
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <TextField
            id="Font-size"
            label="Font Size"
            variant="outlined"
            fullWidth
            onChange={(e) => setFontSize(e.target.value)}
            value={fontSize}
          />
          <TextField
            id="colour"
            label="Colour"
            variant="outlined"
            fullWidth
            onChange={(e) => setColor(e.target.value)}
            value={color}
          />
          <Button variant="contained" onClick={handleSubmit}>
            {initialData ? "Update" : "Add"}
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};
export default SlideModal;
