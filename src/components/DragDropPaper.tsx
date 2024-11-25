import { Paper, Box, Typography, Theme } from "@suid/material";
import { createSignal, JSXElement } from "solid-js";

interface DragDropPaperProps {
  onDrop: (files: FileList) => void;
  children?: JSXElement;
  sx?: SxProps<Theme>;
}

export default function DragDropPaper(props: DragDropPaperProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const dragEnteredElements: Element[] = [];

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    dragEnteredElements.push(e.target as Element);
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    const index = dragEnteredElements.indexOf(e.target as Element);
    if (index > -1) {
      dragEnteredElements.splice(index, 1);
    }
    if (dragEnteredElements.length === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragEnteredElements.length = 0;

    const files = e.dataTransfer?.files;
    if (files) {
      props.onDrop(files);
    }
  };

  return (
    <Paper
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{ 
        p: 2, 
        height: "calc(100vh - 120px)",
        position: "relative",
        ...(props.sx || {})  // Spread custom sx props
      }}
    >
      {isDragging() && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(25, 118, 210, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <Typography variant="h6" color="primary">
            Drop files here
          </Typography>
        </Box>
      )}
      {props.children}
    </Paper>
  );
}