import { Box, Typography } from "@suid/material";

function NotFound() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
       Not Found
      </Typography>
      <Typography variant="body1">
        The page is not found.
      </Typography>
    </Box>
  );
}

export default NotFound;
