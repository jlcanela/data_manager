import JSZip from "jszip";
import { ProcessInfo } from "./Process";

export async function createZipFile(
  map: Map<string, ProcessInfo>
): Promise<Blob> {
  const zip = new JSZip();

  // Add files to zip
  map.values().forEach((info) => {
    zip.file(`${info.name}.bpmn`, info.content);
  });

  // Generate zip file
  const zipContent = await zip.generateAsync({
    type: "blob",
    streamFiles: true,
  });

  return zipContent;
}

export async function importZip(file: File): Promise<Map<string, ProcessInfo>> {
  const fileMap = new Map<string, ProcessInfo>();

  try {
    const reader = new FileReader();
    const zipContent = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });

    const zip = await JSZip.loadAsync(zipContent);

    const promises = Object.keys(zip.files).map(async (filename) => {
      const content = await zip.file(filename)?.async("string");
      if (content) {
        const name = filename.replace(".bpmn", "");
        fileMap.set(name, {
          name: name,
          content: content,
        });
      }
    });

    await Promise.all(promises);
    console.log("filemap", fileMap);
    return fileMap;
  } catch (error) {
    console.error("Failed to process zip file:", error);
    return new Map();
  }
}

export const defaultXml = `<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                    id="Definitions_1"
                    targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="Process_1" isExecutable="true">
      <bpmn:startEvent id="StartEvent_1"/>
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        <bpmndi:BPMNShape id="BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
          <dc:Bounds x="173" y="102" width="36" height="36"/>
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>
  `;