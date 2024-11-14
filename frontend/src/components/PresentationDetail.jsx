import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore, updateStore } from "../api/data";
import ErrorModal from "./ErrorModal";
import PresentationModal from "./PresentationModal";
import TextModal from "./TextModal";
import ImageModal from "./ImageModal";
import VideoModal from "./VideoModal";
import CodeModal from "./CodeModal";
import BackgroundModal from "./BackgroundModal";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"; 

const PresentationDetail = () => {
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [sliedeCount, setSlideCount] = useState(1);
  const currentElements = presentation[currentIndex]?.elements || [];
  const [editingElement, setEditingElement] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [currentFont, setCurrentFont] = useState("Arial, sans-serif"); 
  const [showBgModal, setShowBgModal] = useState(false);
  const { id } = useParams();

   const fontFamilies = [
     { value: "Arial, sans-serif", label: "Arial" },
     { value: "Times New Roman, serif", label: "Times New Roman" },
     { value: "Courier New, monospace", label: "Courier New" },
     { value: "Georgia, serif", label: "Georgia" },
     { value: "Helvetica, sans-serif", label: "Helvetica" },
   ];

  const handleDeleteClickModal = () => {
    setShowDeleteModal(true);
  };

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
  useEffect(() => {
    getPresentationDetail();
  }, [id]);

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
  const handleToPre = () => {
    setCurrentIndex((pre) => (pre > 1 ? pre - 1 : pre));
  };

  const handleToNext = () => {
    setCurrentIndex((pre) => (pre < sliedeCount ? pre + 1 : pre));
  };

  useEffect(() => {
    const keydown = (e) => {
      if (e.key === "ArrowLeft") {
        handleToPre();
      } else if (e.key === "ArrowRight") {
        handleToNext();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => [window.removeEventListener("keydown", keydown)];
  }, [currentIndex, sliedeCount]);

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
            [newSlideNumber]: {},
          },
        },
      };
      await updateStore(updatedStore);
      getPresentationDetail();
      setCurrentIndex(newSlideNumber);
    } catch (error) {
      console.error("Failed to create new slide:", error);
    }
  };

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
      delete updatedStore.store[id][currentIndex];
      await updateStore(updatedStore);
      setSlideCount((prev) => prev - 1);
      if (currentIndex === slides.length) {
        setCurrentIndex((prev) => prev - 1);
      }
      getPresentationDetail();
    } catch (error) {}
  };

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
    setPresentation(presentation);
    setEditingElement(null);
  } catch (error) {
    console.error("Failed to update element:", error);
  }
};
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

    presentation[currentIndex].elements.push(elementData);

    const updatedStore = {
      store: {
        ...data.store,
        [id]: {
          ...presentation,
        },
      },
    };

    await updateStore(updatedStore);
    setPresentation(presentation);
  } catch (error) {
    console.error("Failed to add element:", error);
  }
};

const handleDeleteElement = async (index) => {
  try {
    const data = await getStore();
    const presentation = data.store[id];

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
  
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (selectedElement) {
        e.preventDefault();
        setDeleteIndex(selectedElement.index);
        setShowDeleteModal(true);
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [selectedElement]);

const handleElementClick = (element, index) => {
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - lastClickTime;
if (selectedElement?.index === index && timeDiff < 300) {
  console.log("Double click on:", element.type); 
  setEditingElement({ ...element, index });
} else {
  setSelectedElement({ element, index });
  setLastClickTime(currentTime);
}
};
const handleFontChange = async (event) => {
  if (selectedTextBox === null) return; 

  try {
    const newFont = event.target.value;
    setCurrentFont(newFont);

    const data = await getStore();
    const presentation = data.store[id];

    presentation[currentIndex].elements[selectedTextBox] = {
      ...presentation[currentIndex].elements[selectedTextBox],
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
  } catch (error) {
    console.error("Failed to update font:", error);
  }
};
const handleBackgroundSubmit = async (backgroundData) => {
  try {
    const data = await getStore();
    const presentation = data.store[id];

    if (backgroundData.isDefault) {
      presentation.defaultBackground = backgroundData;
    } else {
      if (!presentation[currentIndex]) {
        presentation[currentIndex] = {};
      }
      presentation[currentIndex].background = backgroundData;
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
const getBackgroundStyle = (background) => {
  if (!background) return {};

  switch (background.type) {
    case "solid":
      return { backgroundColor: background.color };
    case "gradient":
      return {
        background: `linear-gradient(${background.gradientDirection}, ${background.gradientStart}, ${background.gradientEnd})`,
      };
    case "image":
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    default:
      return {};
  }
};


  return (
    <>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Back
      </Button>
      <Button variant="contained" onClick={handleDeleteClickModal}>
        Delete Pre
      </Button>
      <Button variant="contained" onClick={() => setShowEditModal(true)}>
        Edit
      </Button>
      <Typography gutterBottom variant="h5" component="div">
        Title: {presentation?.Title || "Loading..."}
      </Typography>
      <Typography variant="body1" component="div">
        {presentation.description}
      </Typography>
      <Button variant="contained" onClick={createNewSlide}>
        Create
      </Button>
      <Button
        variant="contained"
        onClick={handleDeleteSlide}
        disabled={sliedeCount <= 1}
      >
        Delete Slide
      </Button>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Font Family</InputLabel>
          <Select
            value={currentFont}
            onChange={handleFontChange}
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
      </Box>
      <Button variant="contained" onClick={() => setShowBgModal(true)}>
        Set Background
      </Button>
      <Box
        style={{
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
            onClick={() => handleElementClick(element, index)}
            style={{
              position: "absolute",
              top: `${element.position?.y || 0}%`,
              left: `${element.position?.x || 0}%`,
              width: `${element.size || 10}%`,
              height: `${element.size || 10}%`,
              overflow: "hidden",
              border: `1px solid ${
                selectedElement?.index === index ? "#1976d2" : "grey"
              }`,
              backgroundColor:
                selectedElement?.index === index
                  ? "rgba(25, 118, 210, 0.1)"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            {element.type === "text" && (
              <Box position="relative">
                <Typography
                  style={{
                    fontSize: `${element.fontSize || 1}em`,
                    color: element.color || "#000000",
                    fontFamily: element.fontFamily || currentFont,
                    wordWrap: "break-word",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTextBox(index);
                  }}
                >
                  {element.text}
                </Typography>
              </Box>
            )}
            {element.type === "image" && (
              <img
                src={element.url}
                alt={element.altText || "image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
            {element.type === "video" && (
              <iframe
                src={`${element.url}${
                  element.url.includes("?") ? "&" : "?"
                }autoplay=${element.autoplay ? 1 : 0}`}
                style={{
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
              <pre
                style={{
                  margin: 0,
                  padding: "1em",
                  fontSize: element.fontSize || "1em",
                  fontFamily: "monospace",
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: element.highlightedCode,
                  }}
                  className={`language-${element.language}`}
                />
              </pre>
            )}
          </Box>
        ))}
      </Box>
      <Typography gutterBottom variant="h5" component="div">
        {currentIndex}
      </Typography>
      <TextModal presentationId={id} onSubmit={handleAddElement} />
      <ImageModal presentationId={id} onSubmit={handleAddElement} />
      <VideoModal presentationId={id} onSubmit={handleAddElement} />
      <CodeModal presentationId={id} onSubmit={handleAddElement} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleToPre}
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
    </>
  );
};

export default PresentationDetail;
