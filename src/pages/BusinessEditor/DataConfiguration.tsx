import { Paper, Grid, Typography, TextField } from "@suid/material";
import { Accessor } from "solid-js";
import { TaskInfo } from "../../model/Process";

interface DataConfigurationProps {
  task: Accessor<TaskInfo>;
}

function DataConfiguration(props: DataConfigurationProps) {
  const task = props.task;

  return (
    <Paper sx={{ p: 2, width: "100%", minHeight: "300px" }}>
      {task() && (
        <Grid container spacing={2} direction="column">
          {/* Title Section */}
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              Data Configuration '{task() && task().name}'
            </Typography>
          </Grid>

          {/* Input/Output Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Left Input */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Input"
                  variant="outlined"
                  value={task().input() || ''}
                  onChange={(e) =>
                    task().setInput && task().setInput(e.target.value)
                  }
                />
              </Grid>

              {/* Right Output */}
              <Grid item xs={6}>
                <TextField
                fullWidth
                multiline
                rows={4}
                label="Output"
                variant="outlined"
                value={task().output() || ''}
                onChange={e => 
                  task().setOutput && task().setOutput(e.target.value)}
              />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

export default DataConfiguration;
