import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getStore, updateStore } from "../api/data";
import ErrorModal from "./ErrorModal";
import PresentationModal from "./PresentationModal";
import { Box } from "@mui/material";
import TextModal from "./TextModal";
import ImageModal from "./ImageModal";

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
  const { id } = useParams();

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
  const handleToAddText = async (textBoxData) => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      if (!presentation[currentIndex]?.elements) {
        presentation[currentIndex] = {
          ...presentation[currentIndex],
          elements: [],
        };
      }
      presentation[currentIndex].elements.push(textBoxData);

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
      console.error("Failed to create new slide:", error);
    }
  };
  const handleTextElementClick = (element, index) => {
    console.log("Element clicked:", element, index);
    setEditingElement({ ...element, index });
  };
  const handleEditTextElsment = async (updatedData) => {
    try {
      const data = await getStore();
      const presentation = data.store[id];

      presentation[currentIndex].elements[editingElement.index] = updatedData;

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

  const handleDeleteTextElement = async (index) => {
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
  const handleContextMenu = (e, index) => {
    console.log("Right click triggered", index);
    e.preventDefault();
    e.stopPropagation();
    setDeleteIndex(index);
    setShowDeleteModal(true);
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
      <Box
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid black",
          position: "relative",
        }}
      >
        {currentElements.map((element, index) => (
          <Box
            key={index}
            onClick={() => handleTextElementClick(element, index)}
            onContextMenu={(e) => {
              handleContextMenu(e, index);
            }}
            style={{
              position: "absolute",
              top: `${element.position?.y}%`,
              left: `${element.position?.x}%`,
              width: `${element.size}%`,
              weight: `${element.size}%`,
              color: element.color,
              fontSize: `${element.fontSize}em`,
              overflow: "hidden",
              border: "1px solid grey",
            }}
          >
            {element.text}
          </Box>
        ))}
      </Box>
      <Typography gutterBottom variant="h5" component="div">
        {currentIndex}
      </Typography>
      <TextModal presentationId={id} onSubmit={handleToAddText} />
      <ImageModal />
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
        onConfirm={
          deleteIndex !== null
            ? handleDeleteTextElement
            : handleDeletePresentation
        }
        title="Delete"
        content={
          deleteIndex !== null
            ? "Are you sure to delete this element?"
            : "This presentation will be permanently deleted. Continue?"
        }
      />
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
      {editingElement && (
        <TextModal
          presentationId={id}
          onSubmit={handleEditTextElsment}
          initialData={editingElement}
          onClose={() => setEditingElement(null)}
        />
      )}
    </>
  );
};

export default PresentationDetail;
