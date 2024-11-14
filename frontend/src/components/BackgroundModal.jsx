
import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  InputLabel,
} from "@mui/material";

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

const BackgroundModal = ({ open, onClose, onSubmit, initialData }) => {
  const [bgType, setBgType] = useState(initialData?.type || "solid");
  const [color, setColor] = useState(initialData?.color || "#ffffff");
  const [gradientStart, setGradientStart] = useState(
    initialData?.gradientStart || "#ffffff"
  );
  const [gradientEnd, setGradientEnd] = useState(
    initialData?.gradientEnd || "#000000"
  );
  const [gradientDirection, setGradientDirection] = useState(
    initialData?.gradientDirection || "to bottom"
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  const handleSubmit = () => {
    const backgroundData = {
      type: bgType,
      isDefault,
      ...(bgType === "solid" && { color }),
      ...(bgType === "gradient" && {
        gradientStart,
        gradientEnd,
        gradientDirection,
      }),
      ...(bgType === "image" && { imageUrl }),
    };
    onSubmit(backgroundData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <FormControl fullWidth margin="normal">
          <FormLabel>Background Type</FormLabel>
          <RadioGroup
            value={bgType}
            onChange={(e) => setBgType(e.target.value)}
          >
            <FormControlLabel
              value="solid"
              control={<Radio />}
              label="Solid Color"
            />
            <FormControlLabel
              value="gradient"
              control={<Radio />}
              label="Gradient"
            />
            <FormControlLabel value="image" control={<Radio />} label="Image" />
          </RadioGroup>
        </FormControl>

        {bgType === "solid" && (
          <FormControl fullWidth margin="normal">
            <FormLabel>Color</FormLabel>
            <TextField
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              fullWidth
            />
          </FormControl>
        )}

        {bgType === "gradient" && (
          <>
            <FormControl fullWidth margin="normal">
              <FormLabel>Start Color</FormLabel>
              <TextField
                type="color"
                value={gradientStart}
                onChange={(e) => setGradientStart(e.target.value)}
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <FormLabel>End Color</FormLabel>
              <TextField
                type="color"
                value={gradientEnd}
                onChange={(e) => setGradientEnd(e.target.value)}
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Direction</InputLabel>
              <Select
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
                label="Direction"
              >
                <MenuItem value="to bottom">Top to Bottom</MenuItem>
                <MenuItem value="to right">Left to Right</MenuItem>
                <MenuItem value="to bottom right">Diagonal</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {bgType === "image" && (
          <FormControl fullWidth margin="normal">
            <FormLabel>Image URL</FormLabel>
            <TextField
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              placeholder="Enter image URL"
            />
            {imageUrl && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={imageUrl}
                  alt="Background preview"
                  style={{ maxWidth: "100%", maxHeight: "150px" }}
                />
              </Box>
            )}
          </FormControl>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
          }
          label="Set as default background"
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="contained" onClick={handleSubmit} fullWidth>
            Apply Background
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BackgroundModal;