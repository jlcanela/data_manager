import { Component, createSignal, For } from "solid-js";
import DragDropPaper from "../../components/DragDropPaper";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@suid/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@suid/icons-material";

interface AddProcessProps {
  addProcess: (name: string) => void;
}

const AddProcess: Component<AddProcessProps> = (props) => {
  const [processName, setProcessName] = createSignal("");

  const addProcess = () => {
    if (processName().trim()) {
      props.addProcess(processName().trim());
      setProcessName(""); // Reset the input after adding
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <TextField
        size="small"
        fullWidth
        placeholder="Enter process name"
        value={processName()}
        onChange={(e) => setProcessName(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addProcess();
          }
        }}
      />
      <Button variant="outlined" onClick={addProcess}>
        Add
      </Button>
    </Box>
  );
};

interface ProcessListProps {
  processes: () => string[];
  add: (name: string) => void;
  deleteProcess: (process: string) => void;
  select: (process: string) => void;
  selected: () => string;
  downloadFile: () => void;
  dropFiles: (files: FileList) => void;
}

export default function ProcessList(props: ProcessListProps) {
  return (
    <Paper sx={{}}>
      <DragDropPaper onDrop={props.dropFiles}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: 1,
            px: 2,
            py: 0.5,
            color: "primary.main",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "medium",
              display: "flex",
              alignItems: "center",
            }}
          >
            Download
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              props.downloadFile();
            }}
            sx={{
              color: "primary.main",
              "&:hover": {
                bgcolor: "primary.main",
                color: "white",
              },
              transition: "all 0.2s ease-in-out",
            }}
            title="Download file"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>

        <AddProcess addProcess={props.add} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <For each={props.processes()}>
            {(process) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 0.5, // Minimal horizontal padding
                  py: 0, // Minimal vertical padding
                  minHeight: "28px", // Reduced minimum height
                  bgcolor:
                    props.selected() === process
                      ? "primary.light"
                      : "transparent",
                  color:
                    props.selected() === process
                      ? "primary.contrastText"
                      : "inherit",
                  "&:hover:not(:active)": {
                    bgcolor:
                      props.selected() === process
                        ? "primary.dark" // Darker shade for selected items
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
                onclick={() => props.select(process)}
              >
                <Typography>{process}</Typography>
                <IconButton
                  size="small"
                  onClick={() => props.deleteProcess(process)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </For>
        </Box>
      </DragDropPaper>
    </Paper>
  );
}
