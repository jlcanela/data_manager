declare module "solid-js" {
  namespace JSX {
    interface Directives {
      draggable: boolean;
      droppable: boolean;
    }
  }
}

import { Checkbox, FormControlLabel, styled } from "@suid/material";
import { createSignal, For } from "solid-js";
import type { Component } from "solid-js";
import {
  DragDropDebugger,
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  createDraggable,
  createDroppable,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";

interface JsonItemProps {
  id: any,
  depth: number;
  color: string;
  children?: any;
}

interface JsonNodeProps {
  data: any;
  depth?: number;
  path?: string[];
}

const JsonContainer = styled("div")({
  padding: "10px",
  fontFamily: "monospace",
  fontSize: "14px",
  display: "flex",
  flexDirection: "column",
  minHeight: "50px",
});

const JsonItem = (props: JsonItemProps) => {

  const ctx = useDragDropContext();

  const draggable = createDraggable(props.id);
  const droppable = createDroppable(props.id);
  const Item = styled("div")<JsonItemProps>((props) =>  {
    return ({
      margin: "4px 0",
      padding: "6px 12px",
      borderRadius: "4px",
      backgroundColor: props.props.color, //'red', //props.ownerState.color,
      marginLeft: `${props.props.depth * 20}px`,
      display: "block",
      maxWidth: "300px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      cursor: "pointer",
      width: "fit-content",
      userSelect: "none",
    })
});
return (
    <Item ref={el => {
        draggable(el);
        droppable(el);
      }} 
      class="draggable droppable"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
      id= {props.id} 
      depth={props.depth}
      color={props.color}>{props.children}</Item>

    )
}

const NodeWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const getColor = (depth: number): string => {
  const colors = ["#e8f0fe", "#e6f4ea", "#fff8e1"];
  return colors[depth % colors.length];
};

const JsonNode: Component<JsonNodeProps> = (props) => {
  const depth = props.depth || 0;

  const renderValue = (key: string, value: any) => {
    const currentPath = [...(props.path || []), key];

    if (typeof value === "object" && value !== null) {
      return (
        <NodeWrapper>
          <JsonItem id={key} depth={ depth} color= {getColor(depth) }>
            {key}: {"{"}
          </JsonItem>
          <div>
            <JsonNode data={value} depth={depth + 1} path={currentPath} />
          </div>
        </NodeWrapper>
      );
    }

    return (
      <JsonItem  id={key} depth={ depth} color= {getColor(depth) }>
        {key}: {JSON.stringify(value)}
      </JsonItem>
    );
  };

  return (
    <NodeWrapper>
      <For each={Object.entries(props.data)}>
        {([key, value]) => renderValue(key, value)}
      </For>
    </NodeWrapper>
  );
};

const JsonViewer: Component<{ data: object }> = (props) => {
  
  const [showDebugger, setShowDebugger] = createSignal(false);


  const handleDragEnd: DragEventHandler = (ev) => {    
    console.log(ev, ev.draggable, ev.droppable);
  };

  return (
    <>
    <FormControlLabel
      control={
        <Checkbox
        checked={showDebugger()}
        onChange={() => {
          setShowDebugger(!showDebugger());
        }}
        
        />
      }
      label="Show DragDrop Debugger"
      />
      {showDebugger() ? "true" : "false"}

      <DragDropProvider onDragEnd={handleDragEnd}>
      {showDebugger() && <DragDropDebugger/>}
        <DragDropSensors>
          <JsonContainer>
            <JsonNode data={props.data} path={[]} />
          </JsonContainer>
        </DragDropSensors>
      </DragDropProvider>
    </>
  );
};

export default JsonViewer;
