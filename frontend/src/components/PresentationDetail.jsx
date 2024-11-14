import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore, updateStore } from "../api/data";
import ErrorModal from "./ErrorModal";
import PresentationModal from "./PresentationTitleModal";
import TextModal from "./TextModal";
import ImageModal from "./ImageModal";
import VideoModal from "./VideoModal";
import CodeModal from "./CodeModal";
import BackgroundModal from "./BackgroundModal";
import ThumbnailModal from "./ThumbnailModal ";
import { Box, FormControl, InputLabel, Select, MenuItem,Paper,
  Stack } from "@mui/material"; 
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import ColorizeIcon from "@mui/icons-material/Colorize";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";

const PresentationDetail = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingThumbnail, setEditingThumbnail] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [sliedeCount, setSlideCount] = useState(1);
  const currentElements = presentation[currentIndex]?.elements || [];
  const [editingElement, setEditingElement] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [currentFont, setCurrentFont] = useState("Arial, sans-serif");
  const [showBgModal, setShowBgModal] = useState(false);
  const { id } = useParams();

  // Defines font options for the presentation editor.
  const fontFamilies = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Times New Roman, serif", label: "Times New Roman" },
    { value: "Courier New, monospace", label: "Courier New" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Helvetica, sans-serif", label: "Helvetica" },
  ];
  // Updates `currentIndex` based on the slide parameter in the URL whenever it changes.
  useEffect(() => {
    const slideNumber = new URLSearchParams(location.search).get("slide");
    if (slideNumber) {
      setCurrentIndex(parseInt(slideNumber, 10));
    }
  }, [location.search]);
  // Opens the delete confirmation modal when the delete button is clicked.
  const handleDeleteClickModal = () => {
    setShowDeleteModal(true);
  };
  // Fetches presentation details and updates state.
  const getPresentationDetail = async () => {
    setLoading(true);
    try {
      const data = await getStore();
      if (data && data.store) {
        const presentationDetail = data.store[id];
        if (presentationDetail) {
          setPresentation({ id, ...presentationDetail });
          const slides = Object.keys(presentationDetail).filter(
            (key) => !isNaN(key)
          );
          setSlideCount(slides.length);
        } else {
          console.error("Presentation not found");
        }
      }
    } catch (error) {
      console.error("Error fetching presentations:", error);
    }
  };
  // Loads presentation details when the id changes.
  useEffect(() => {
    getPresentationDetail();
  }, [id]);

  // Deletes the current presentation
  const handleDeletePresentation = async () => {
    try {
      const data = await getStore();

      const updatedStore = {
        store: { ...data.store },
      };
      delete updatedStore.store[id];

      await updateStore(updatedStore);
      setShowDeleteModal(false);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to delete presentation");
    }
  };
  // Navigates to the previous slide
  const handlePrevious = () => {
    if (currentIndex > 1) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      navigate(`?slide=${newIndex}`, { replace: true });
    }
  };
  // Navigates to the next slide
  const handleToNext = () => {
    if (currentIndex < sliedeCount) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      navigate(`?slide=${newIndex}`, { replace: true });
    }
  };
  // Adds keyboard navigation for slides using arrow keys.
  useEffect(() => {
    const keydown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleToNext();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => [window.removeEventListener("keydown", keydown)];
  }, [currentIndex, sliedeCount]);
  // Creates a new slide and navigates to it.
  const createNewSlide = async () => {
    try {
      const data = await getStore();

      const presentation = data.store[id];
      const newSlideNumber =
        Object.keys(presentation).filter((key) => !isNaN(key)).length + 1;

      const updatedStore = {
        store: {
          ...data.store,
          [id]: {
            ...presentation,
            [newSlideNumber]: {}, // Add a new empty slide
          },
        },
      };
      await updateStore(updatedStore);
      getPresentationDetail(); // Refresh presentation data
      setCurrentIndex(newSlideNumber); // Navigate to the new slide
    } catch (error) {
      console.error("Failed to create new slide:", error);
    }
  };
  // Deletes the current slide
  const handleDeleteSlide = async () => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      const slides = Object.keys(presentation).filter((key) => !isNaN(key));
      if (slides.length <= 1) {
        alert("Cannot delete the last slide");
        return;
      }

      const updatedStore = {
        store: {
          ...data.store,
          [id]: {
            ...presentation,
          },
        },
      };
      delete updatedStore.store[id][currentIndex]; // Remove current slide
      await updateStore(updatedStore);
      setSlideCount((prev) => prev - 1); // Update slide count
      if (currentIndex === slides.length) {
        setCurrentIndex((prev) => prev - 1);
      }
      getPresentationDetail();
    } catch (error) {}
  };
  // Updates a specific element
  const handleEditElement = async (updatedData) => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      presentation[currentIndex].elements[editingElement.index] = {
        ...presentation[currentIndex].elements[editingElement.index],
        ...updatedData,
      };

      const updatedStore = {
        store: {
          ...data.store,
          [id]: presentation,
        },
      };

      await updateStore(updatedStore);
      setPresentation(presentation); // Update state with the modified presentation
      setEditingElement(null); // Exit edit mode
    } catch (error) {
      console.error("Failed to update element:", error);
    }
  };
  // Adds a new element to the current slide.
  const handleAddElement = async (elementData) => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      if (!presentation[currentIndex]?.elements) {
        presentation[currentIndex] = {
          ...presentation[currentIndex],
          elements: [],
        };
      }

      presentation[currentIndex].elements.push(elementData); // Add new element

      const updatedStore = {
        store: {
          ...data.store,
          [id]: {
            ...presentation,
          },
        },
      };

      await updateStore(updatedStore);
      setPresentation(presentation); // Refresh presentation data
    } catch (error) {
      console.error("Failed to add element:", error);
    }
  };
  // Deletes an element from the current slide.
  const handleDeleteElement = async (index) => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      // Remove the element by index
      presentation[currentIndex].elements = presentation[
        currentIndex
      ].elements.filter((_, i) => i !== index);

      const updatedStore = {
        store: {
          ...data.store,
          [id]: presentation,
        },
      };

      await updateStore(updatedStore);
      setPresentation(presentation);
      setShowDeleteModal(false);
      setDeleteIndex(null);
    } catch (error) {
      console.error("Failed to delete element:", error);
    }
  };
  // Opens the delete modal on right-click
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (selectedElement) {
        e.preventDefault();
        setDeleteIndex(selectedElement.index); // Set the index of the element to delete
        setShowDeleteModal(true);
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [selectedElement]);
  // Handles element selection and double-click for editing.
  const handleElementClick = (element, index) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    if (selectedElement?.index === index && timeDiff < 300) {
      setEditingElement({ ...element, index }); // Enter edit mode for the element
    } else {
      setSelectedElement({ element, index }); // Select the clicked element
      setLastClickTime(currentTime); // Update last click time
    }
  };
  // Updates the font of the selected element and saves it.
  const handleFontChange = async (event) => {
    const newFont = event.target.value;
    setCurrentFont(newFont);

    if (selectedElement) {
      try {
        const data = await getStore();
        const presentation = data.store[id];
        if (presentation[currentIndex]?.elements?.[selectedElement.index]) {
          presentation[currentIndex].elements[selectedElement.index] = {
            ...presentation[currentIndex].elements[selectedElement.index],
            fontFamily: newFont,
          };

          const updatedStore = {
            store: {
              ...data.store,
              [id]: presentation,
            },
          };

          await updateStore(updatedStore);
          setPresentation(presentation);
        }
      } catch (error) {
        console.error("Failed to update font:", error);
      }
    }
  };
  // Sets the background for the slide
  const handleBackgroundSubmit = async (backgroundData) => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      if (backgroundData.isDefault) {
        presentation.defaultBackground = backgroundData; // Set default background
      } else {
        if (!presentation[currentIndex]) {
          presentation[currentIndex] = {};
        }
        presentation[currentIndex].background = backgroundData; // Update current slide background
      }

      const updatedStore = {
        store: {
          ...data.store,
          [id]: presentation,
        },
      };

      await updateStore(updatedStore);
      setPresentation(presentation);
    } catch (error) {
      console.error("Failed to update background:", error);
    }
  };
  // Returns the CSS style based on the background type.
  const getBackgroundStyle = (background) => {
    if (!background) return {};

    switch (background.type) {
      case "solid":
        return { backgroundColor: background.color }; // Solid color background
      case "gradient":
        return {
          background: `linear-gradient(${background.gradientDirection}, ${background.gradientStart}, ${background.gradientEnd})`,
        }; // Gradient background
      case "image":
        return {
          backgroundImage: `url(${background.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }; // Image background
      default:
        return {};
    }
  };
  // Opens the preview for the current slide.
  const handlePreview = () => {
    navigate(`/presentation/${id}/preview?slide=${currentIndex}`); // Navigate to the preview page
  };

  const handleThumbnailUpdate = async (thumbnailData) => {
    try {
      const data = await getStore();
      const presentationData = data.store[id];

      const updatedStore = {
        store: {
          ...data.store,
          [id]: {
            ...presentationData,
            thumbnailUrl: thumbnailData.thumbnailUrl, // Update thumbnail URL
          },
        },
      };

      await updateStore(updatedStore);
      getPresentationDetail();
    } catch (error) {
      console.error("Failed to update thumbnail:", error);
    }
  };

  return (
    <Box>
      {/* Basic Operations Bar */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, p: 1 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          size="small"
          sx={{ color: "#3479E8" }}
        >
          BACK
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClickModal}
          size="small"
          sx={{ color: "#3479E8" }}
        >
          DELETE
        </Button>
        <Button
          startIcon={<EditIcon />}
          onClick={() => setShowEditModal(true)}
          size="small"
          sx={{ color: "#3479E8" }}
        >
          EDIT
        </Button>
        <Button
          startIcon={<ImageIcon />}
          onClick={() => setEditingThumbnail(presentation)}
          size="small"
          sx={{ color: "#3479E8" }}
        >
          THUMBNAIL
        </Button>
        <FormControl size="small" sx={{ minWidth: 150, zIndex: 2 }}>
          <InputLabel>Font Family</InputLabel>
          <Select
            value={currentFont}
            onChange={(e) => {
              setCurrentFont(e.target.value);
              if (selectedElement) {
                handleFontChange(e);
              }
            }}
            label="Font Family"
          >
            {fontFamilies.map((font) => (
              <MenuItem
                key={font.value}
                value={font.value}
                sx={{ fontFamily: font.value }}
              >
                {font.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Title and Description */}
      <Typography gutterBottom variant="h5" component="div">
        Title: {presentation?.Title || "Loading..."}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{ mb: 2, color: "text.secondary" }}
      >
        {presentation.description}
      </Typography>

      {/* Edit tool */}
      <Paper sx={{ p: 1 }}>
        <Stack direction="row" alignItems="center">
          <Button size="small" onClick={createNewSlide}>
            <AddIcon />
          </Button>
          <Button
            size="small"
            onClick={handleDeleteSlide}
            disabled={sliedeCount <= 1}
          >
            <DeleteIcon />
          </Button>

          <TextModal presentationId={id} onSubmit={handleAddElement} />
          <ImageModal presentationId={id} onSubmit={handleAddElement} />
          <VideoModal presentationId={id} onSubmit={handleAddElement} />
          <CodeModal presentationId={id} onSubmit={handleAddElement} />

          <Button size="small" onClick={() => setShowBgModal(true)}>
            <ColorizeIcon />
          </Button>

          <Button size="small" onClick={handlePreview}>
            <PreviewIcon />
          </Button>
        </Stack>
      </Paper>

      {/* Edit area*/}
      <Box
        sx={{
          width: "100%",
          height: "500px",
          border: "1px solid black",
          position: "relative",
          ...getBackgroundStyle(
            presentation[currentIndex]?.background ||
              presentation?.defaultBackground
          ),
        }}
      >
        {currentElements.map((element, index) => (
          <Box
            key={index}
            onMouseDown={(e) => handleElementClick(element, index)}
            sx={{
              position: "absolute",
              top: `${element.position?.y || 0}%`,
              left: `${element.position?.x || 0}%`,
              width: `${element.size || 10}%`,
              height: `${element.size || 10}%`,
              overflow: "hidden",
              border: `1px solid ${
                selectedElement?.index === index ? "#1976d2" : "grey"
              }`,
              bgcolor:
                selectedElement?.index === index
                  ? "rgba(25, 118, 210, 0.1)"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            {element.type === "text" && (
              <Box position="relative">
                <Typography
                  sx={{
                    fontSize: `${element.fontSize || 1}em`,
                    color: element.color || "#000000",
                    fontFamily: element.fontFamily || currentFont,
                    wordWrap: "break-word",
                  }}
                >
                  {element.text}
                </Typography>
              </Box>
            )}
            {element.type === "image" && (
              <Box
                component="img"
                src={element.url}
                alt={element.altText || "image"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
            {element.type === "video" && (
              <Box
                component="iframe"
                src={`${element.url}${
                  element.url.includes("?") ? "&" : "?"
                }autoplay=${element.autoplay ? 1 : 0}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded video"
              />
            )}
            {element.type === "code" && (
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1,
                  fontSize: element.fontSize || "1em",
                  fontFamily: "monospace",
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  bgcolor: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                }}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: element.highlightedCode,
                  }}
                  className={`language-${element.language}`}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Slide count and naviagte */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography
          gutterBottom
          variant="body2"
          component="div"
          align="left"
          sx={{
            mb: 2,
            color: "text.secondary",
          }}
        >
          Slide {currentIndex} of {sliedeCount}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={currentIndex === 1}
            sx={{
              minWidth: "120px",
              height: "40px",
            }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleToNext}
            disabled={currentIndex === sliedeCount}
            sx={{
              minWidth: "120px",
              height: "40px",
            }}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Modal Component */}
      <ErrorModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteIndex(null);
        }}
        onConfirm={() => {
          if (deleteIndex !== null) {
            handleDeleteElement(deleteIndex);
          } else {
            handleDeletePresentation();
          }
        }}
        title="Delete"
        content={
          deleteIndex !== null
            ? "Are you sure to delete this element?"
            : "This presentation will be permanently deleted. Continue?"
        }
      />
      <BackgroundModal
        open={showBgModal}
        onClose={() => setShowBgModal(false)}
        onSubmit={handleBackgroundSubmit}
        initialData={
          presentation[currentIndex]?.background ||
          presentation?.defaultBackground
        }
      />
      {editingThumbnail && (
        <ThumbnailModal
          onSubmit={handleThumbnailUpdate}
          initialData={editingThumbnail}
          onClose={() => setEditingThumbnail(null)}
        />
      )}
      {showEditModal && (
        <PresentationModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            getPresentationDetail();
            setShowEditModal(false);
          }}
          mode="edit"
          initialData={presentation}
        />
      )}
      {editingElement?.type === "text" && (
        <TextModal
          presentationId={id}
          onSubmit={handleEditElement}
          initialData={editingElement}
          onClose={() => setEditingElement(null)}
        />
      )}
      {editingElement?.type === "image" && (
        <ImageModal
          presentationId={id}
          onSubmit={handleEditElement}
          initialData={editingElement}
          onClose={() => setEditingElement(null)}
        />
      )}
      {editingElement?.type === "video" && (
        <VideoModal
          presentationId={id}
          onSubmit={handleEditElement}
          initialData={editingElement}
          onClose={() => setEditingElement(null)}
        />
      )}
      {editingElement?.type === "code" && (
        <CodeModal
          presentationId={id}
          onSubmit={handleEditElement}
          initialData={editingElement}
          onClose={() => setEditingElement(null)}
        />
      )}
    </Box>
  );
};

export default PresentationDetail;
