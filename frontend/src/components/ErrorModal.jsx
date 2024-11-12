import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ErrorModal = ({ open, onClose, onConfirm, title, content }) => {
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

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="confirm-modal-title">
      <Box sx={style}>
        <Typography id="confirm-modal-title" variant="h6" component="h2">
          {title || "Confirm"}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {content || "Are you sure to delete this slide?"}
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
