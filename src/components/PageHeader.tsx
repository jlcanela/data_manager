import { Box, Divider, Typography } from "@suid/material";

export default function PageHeader({ title }: { title: string }) {
    return (
      <Box sx={{ mb: 4, textAlign: "center", position: "relative" }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {title}
        </Typography>
        <Divider variant="middle" sx={{ width: '50%', mx: 'auto', my: 2 }} />
      </Box>
    );
  }
  