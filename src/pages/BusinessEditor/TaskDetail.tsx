import { Box, Button, Paper, Typography } from "@suid/material";
import { ShapeInfo } from "../../components/BpmnViewer";
import { Accessor, createEffect } from "solid-js";

interface TaskDetailProps {
  task: Accessor<ShapeInfo>;
}

export default function TaskDetail(props: TaskDetailProps) {

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Current Step
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined">Add Input</Button>
        <Button variant="outlined">Add Output</Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined" endIcon="▼">
          Ref Input
        </Button>
        <Button variant="outlined" endIcon="▼">
          Ref Output
        </Button>
      </Box>
      <Box
        sx={{
          minHeight: "200px",
          border: "1px dashed #ccc",
          p: 2,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 2,
        }}
      >
        {/* Input boxes */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            Input A
          </Paper>
          <Paper variant="outlined" sx={{ p: 1 }}>
            Input B
          </Paper>
          <Paper variant="outlined" sx={{ p: 1 }}>
            Input C
          </Paper>
        </Box>

        {/* Step */}
        <Paper
          sx={{
            p: 2,
            alignSelf: "center",
            borderRadius: "50%",
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.task()?.name || 'unknown'}
        </Paper>

        {/* Output boxes */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 1 }}>
            Output A
          </Paper>
          <Paper variant="outlined" sx={{ p: 1 }}>
            Output B
          </Paper>
        </Box>
      </Box>
    </Paper>
  );
}
