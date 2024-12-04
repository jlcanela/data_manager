import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    createDraggable,
    createDroppable,
    useDragDropContext,
  } from "@thisbeyond/solid-dnd";
  import { createSignal, Show } from "solid-js";
  
//  import "./DragDrop.css";

  const Draggable = () => {
    const ctx = useDragDropContext();
    if (!ctx) return null;
    //const [, { onDragEnd }] 
    //const onDragEnd = ctx[1].onDragEnd; 
    const draggable = createDraggable(1);
    return (
      <div use:draggable class="draggable">
        Draggable
      </div>
    );
  };
  
  interface DroppableProps {
    class?: string;
    classList?: { [key: string]: boolean };
    children?: any;
  }

  const Droppable = (props: DroppableProps) => {
    const droppable = createDroppable(1);
    return (
      <div
        use:droppable
        class="droppable"
        classList={{ "!droppable-accept": droppable.isActiveDroppable }}
      >
        Droppable
        {props.children}
      </div>
    );
  };
  
  export const DragAndDropExample = () => {
    const [where, setWhere] = createSignal("outside");
  
    const handleDragEnd: DragEventHandler = ({ droppable }) => {
      if (droppable) {
        setWhere("inside");
      } else {
        setWhere("outside");
      }
    };
  
    return (
      <DragDropProvider onDragEnd={handleDragEnd}>
        <DragDropSensors>
          <div class="min-h-15">
            <Show when={where() === "outside"}>
              <Draggable />
            </Show>
          </div>
          <Droppable>
            <Show when={where() === "inside"}>
              <Draggable />
            </Show>
          </Droppable>
        </DragDropSensors>
      </DragDropProvider>
    );
  };
