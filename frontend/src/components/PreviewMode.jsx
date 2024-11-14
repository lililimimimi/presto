import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { getStore } from "../api/data";

const PreviewMode = () => {
  const [presentation, setPresentation] = useState({});
  const [currentIndex, setCurrentIndex] = useState(1);
  const [slideCount, setSlideCount] = useState(1);
  const { id } = useParams();

  const currentElements = presentation[currentIndex]?.elements || [];

  useEffect(() => {
    const getPresentation = async () => {
      try {
        const data = await getStore();
        if (data && data.store && data.store[id]) {
          setPresentation(data.store[id]);
          const slides = Object.keys(data.store[id]).filter(
            (key) => !isNaN(key)
          );
          setSlideCount(slides.length);
        }
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };
    getPresentation();
  }, [id]);

  const handleToPre = () => {
    setCurrentIndex((pre) => (pre > 1 ? pre - 1 : pre));
  };

  const handleToNext = () => {
    setCurrentIndex((pre) => (pre < slideCount ? pre + 1 : pre));
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
    return () => window.removeEventListener("keydown", keydown);
  }, [currentIndex, slideCount]);

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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "black",
      }}
    >
      <Box
        sx={{
          flex: 1,
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
            style={{
              position: "absolute",
              top: `${element.position?.y || 0}%`,
              left: `${element.position?.x || 0}%`,
              width: `${element.size || 10}%`,
              height: `${element.size || 10}%`,
              overflow: "hidden",
            }}
          >
            {element.type === "text" && (
              <Typography
                style={{
                  fontSize: `${element.fontSize || 1}em`,
                  color: element.color || "#000000",
                  fontFamily: element.fontFamily || "Arial, sans-serif",
                  wordWrap: "break-word",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {element.text}
              </Typography>
            )}
            {element.type === "image" && (
              <img
                src={element.url}
                alt={element.altText || "content"}
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
              <pre>
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

      <Box>
        <Button
          variant="contained"
          onClick={handleToPre}
          disabled={currentIndex === 1}
        >
          Previous
        </Button>
        <Typography>
          {currentIndex} / {slideCount}
        </Typography>
        <Button
          variant="contained"
          onClick={handleToNext}
          disabled={currentIndex === slideCount}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PreviewMode;
