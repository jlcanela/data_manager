import { ProcessModel } from "../../model/Process";
import { createZipFile, importZip } from "../../model/zip";
import { Box, Container, Paper, Typography } from "@suid/material";
import ProcessList from "./ProcessList";
import { BpmnModeler } from "../../components/BpmnViewer";
import DataConfiguration from "./DataConfiguration";

// components/BusinessEditor.tsx
export default function BusinessEditor() {
  const model = new ProcessModel();

  const dropFiles = async (files: FileList) => {
    if (files.length > 0 && files[0].name.endsWith(".zip")) {
      const firstFile = files[0];
      const map = await importZip(firstFile);
      model.setProcesses(map);
      model.setCurrentProcess(map.keys().next().value);
    }
  };

  const updateXml = (newXml: string) => {
    const currentProcess = model.getCurrentProcess();
    model.updateProcessXml(currentProcess(), newXml);
  };

  const downloadFile = async () => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(
      await createZipFile(model.getProcesses()())
    );
    link.download = "bpmn_archive.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  };

  return (
    <Container maxWidth={"xxl"} sx={{ mt: 4 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 3 }}>
        <ProcessList
          dropFiles={dropFiles}
          downloadFile={downloadFile}
          selected={model.getCurrentProcess()}
          processes={() => model.getProcesses()().keys().toArray()}
          add={model.addProcess.bind(model)}
          deleteProcess={model.deleteProcess.bind(model)}
          select={model.setCurrentProcess.bind(model)}
        />

        {/* Right Column - Process Detail */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {model.getCurrentProcess()()}
            </Typography>
            <Box sx={{ height: "95%", border: "1px dashed #ccc" }}>
              {model.xml() && (
                <BpmnModeler xml={model.xml()()} updateXml={updateXml} updateSelection={model.setSelectedTask} />
              )}
            </Box>
          </Paper>

          <DataConfiguration task={model.selectedTask}/>
        </Box>
      </Box>
    </Container>
  );
}
