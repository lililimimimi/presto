import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logout = (props) => {
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    props.setToken(null);
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#f5f5f5",
          boxShadow: "none",
          color: "black",
          width: "100%",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          {/* Left Presto */}
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Presto
          </Typography>

          {/* Right Button */}
          <Box>
            {props.token === null ? (
              <>
                <Button
                  variant="contained"
                  sx={{ marginRight: 2, minWidth: "100px" }}
                  onClick={() => navigate("/login")}
                  size="medium"
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                  size="medium"
                  sx={{ minWidth: "100px" }}
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{ minWidth: "100px" }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Logout;
