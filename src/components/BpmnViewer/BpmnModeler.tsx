import { createEffect, createMemo, createSignal, onMount, Signal } from "solid-js";


import Modeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";

import { Box } from "@suid/material";
import {
  getShape,
  getShapeInfo,
  jlcModdle,
  readCustomProperties,
  setCustomProperties,
} from "./BpmnRepository";
import { TaskInfo } from "../../model/Process";

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import './style.css';

// Define the createForm function with TypeScript
const createBpmnModeler = async (
  props: BpmnModelerProps,
  container: HTMLElement,
  xml: string,
  setShapeInfo?: (ShapeInfo) => void
) => {
  let modeler;

  const baseConfig = {
    container: container,
    propertiesPanel: {
      parent: "#properties",
    },
    keyboard: {
      bindTo: window,
    },
    // Add event bus configuration
    eventBus: {
      eventListenerOptions: {
        passive: true,
      },
    },
  };

  if (props.camunda) {
    modeler = new Modeler({
      ...baseConfig,
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
      ],
      moddleExtensions: {
        camunda: CamundaBpmnModdle,
        jlc: jlcModdle,
      },
    });
  } else {
    modeler = new Modeler({
      ...baseConfig,
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
      moddleExtensions: {
        jlc: jlcModdle,
      },
    });
  }

  // Get required modules
  const modeling = modeler.get("modeling");
  const moddle = modeler.get("moddle");
  const elementRegistry = modeler.get("elementRegistry");

  createEffect(async () => {
    if (props && props.xml && props.xml !== "") {
      // Handle XML updates here
      await modeler.importXML(props.xml);
    } else {
      await modeler.createDiagram();
    }
  });

  modeler.get("canvas").zoom("fit-viewport");

  props.updateXml &&
    modeler.on("commandStack.changed", function () {
      Promise.resolve()
        .then(() => modeler.saveXML({ format: true }))
        .then((result) => {
          props.updateXml(result.xml);
        });
    });

  props.updateSelection &&
    modeler.on("selection.changed", (e) => {
      const el = getShape(e);
      const shapeInfo = getShapeInfo(el, readCustomProperties);

      setShapeInfo && setShapeInfo(shapeInfo);
    });

  return (el, input, output) => setCustomProperties(modeling, moddle, el, input, output);
};

interface BpmnModelerProps {
  xml?: string;
  camunda?: boolean;
  updateXml?: (string) => void;
  updateSelection?: (TaskInfo) => void;
}

interface Context {
  input: string;
  output: string;
  element: any;
}

export function BpmnModeler(props: BpmnModelerProps) {
  let container!: HTMLDivElement; // Use non-null assertion to indicate that this will be assigned
  let setProperties: (el: any, input: string, output: string) => void;

  const context = createSignal<Context>(undefined);
  const input = createMemo(() => context[0]()?.input);
  const output = createMemo(() => context[0]()?.output);
  
  const updateShapeInfo = (shapeInfo) => {
    const ctx = shapeInfo ? {
      input: shapeInfo.input,
      output: shapeInfo.output,
      element: shapeInfo.element
    } : undefined;

    context && context[1](ctx);

    const taskInfo = shapeInfo ?  {
        id: shapeInfo.id,
        type: shapeInfo.type,
        name: shapeInfo.name,
        input: input,
        setInput: (s) => {
          const ctx = { ...context[0](), input: s };
          setProperties && setProperties(ctx.element, s, ctx.output);
          context[1](ctx);
        },
        output: output,
        setOutput: (s) => {
          const ctx = { ...context[0](), output: s };
          setProperties && setProperties(ctx.element, ctx.input, s);
          context[1](ctx);
        },
      } : undefined;
      taskInfo && props.updateSelection(undefined);
      props.updateSelection(taskInfo);

  };

  onMount(async () => {
    setProperties = await createBpmnModeler(props, container, props.xml, updateShapeInfo);
  });

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        //height: `${height}px`,
        margin: "0 auto",
      }}
    >
      <div class="modeler" style="width: 70%;">
        {/* Flexbox container for side-by-side layout */}
        {/* Canvas - 60% width */}
        <div
          ref={(el) => (container = el as HTMLDivElement)}
          id="canvas"
          style={{
            "flex-basis": "60%",
            border: "1px solid black",
            height: "100%",
            "background-color": "lightgray", // Ensure background color is applied here
          }}
        ></div>
      </div>
      {/* Properties Panel - 40% width */}
      <div
        id="properties"
        style={{
          "flex-basis": "40%",
          border: "1px solid grey",
          width: "30%",
          height: "100%",
        }}
      ></div>
    </Box>
  );
}
