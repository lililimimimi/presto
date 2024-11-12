import * as React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const MediaCard = ({ id, title, description}) => {
  const navigate = useNavigate();

  const goToSinglePresentation = (id) => {
    navigate(`/presentation/${id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "600px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            height: "150px",
            backgroundColor: "#f5f5f5",
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Slides: 1
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => goToSinglePresentation(id)}>
            Edit
          </Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default MediaCard;
