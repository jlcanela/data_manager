import Canvas from "diagram-js/lib/core/Canvas";
import Viewer from "bpmn-js/lib/Viewer";
import { onMount } from "solid-js";

export function hasErrors(errors: Record<string, any>): boolean {
  return Object.keys(errors).length > 0;
}

export function BpmnViewer({ xml, height }: { xml: string; height: number }) {
  let container!: HTMLDivElement; // Use non-null assertion to indicate that this will be assigned

  // Define the createForm function with TypeScript
  const createBpmnViewer = async (
    container: HTMLElement,
    xml: string,
    height: number
  ) => {
    const viewer = new Viewer({
      container: container,
      height: height,
      eventBus: {
        eventListenerOptions: {
          passive: true,
        },
      },
    });

    try {
      await viewer.importXML(xml);
      const canvas = viewer.get("canvas") as Canvas;
      canvas.zoom("fit-viewport");
      return viewer;
    } catch (err) {
      console.error("Error importing XML:", err);
      throw err;
    }
  };

  onMount(() => {
    // Use the createForm method
    createBpmnViewer(container, xml, height);
  });

  return (
    <div>
      <div ref={(el) => (container = el as HTMLDivElement)}></div>
    </div>
  );
}
