import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-c";
import CodeIcon from "@mui/icons-material/Code";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400, 
  maxHeight: "80vh", 
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const detectLanguage = (code) => {
  if (!code) return "python";

  const lowerCode = code.toLowerCase();

  if (
    lowerCode.includes("def ") ||
    lowerCode.includes("import ") ||
    lowerCode.includes("print(")
  ) {
    return "python";
  }

  if (
    lowerCode.includes("console.log") ||
    lowerCode.includes("function") ||
    lowerCode.includes("let ") ||
    lowerCode.includes("const ")
  ) {
    return "javascript";
  }

  if (lowerCode.includes("#include") || lowerCode.includes("int main")) {
    return "c";
  }

  return "python";
};

const CodeModal = ({ onSubmit, initialData = null, onClose }) => {
  const [open, setOpen] = useState(Boolean(initialData));
  const [size, setSize] = useState(initialData?.size || "30");
  const [code, setCode] = useState(initialData?.code || "");
  const [fontSize, setFontSize] = useState(initialData?.fontSize || "1");
  const [language, setLanguage] = useState(initialData?.language || "python");

  const handleClose = () => {
    setOpen(false);
     if (!initialData) {
       setSize("30"); 
       setCode(""); 
       setFontSize("1"); 
       setLanguage("python"); 
     }
    if (onClose) onClose();
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    if (!initialData && newCode.trim()) {
      try {
        const detectedLang = detectLanguage(newCode);
        setLanguage(detectedLang);
      } catch (error) {
        console.error("Language detection error:", error);
      }
    }
  };

  const handleSubmit = () => {
    const highlightedCode = Prism.highlight(
      code,
      Prism.languages[language],
      language
    );

    const codeData = {
      type: "code",
      size,
      code,
      highlightedCode,
      fontSize: `${fontSize}em`,
      language,
      position: initialData?.position || { x: 0, y: 0 },
    };
    onSubmit(codeData);
    handleClose();
  };

  return (
    <Box>
      {!initialData && (
        <Button onClick={() => setOpen(true)}><CodeIcon /></Button>
      )}
      <Modal open={initialData ? true : open} onClose={handleClose}>
        <Box sx={style}>
          <TextField
            label="Block Size (%)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) => setSize(e.target.value)}
            value={size}
          />

          <TextField
            label="Font Size (em)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) => setFontSize(e.target.value)}
            value={fontSize}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="c">C</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Code"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={10}
            onChange={handleCodeChange}
            value={code}
            InputProps={{
              style: {
                fontFamily: "monospace",
                whiteSpace: "pre",
              },
            }}
          />

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

export default CodeModal;
