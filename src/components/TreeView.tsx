// components/TreeView/TreeView.tsx
import { Component, For, JSX, Show } from "solid-js";
import { Box, IconButton, Stack, styled } from "@suid/material";
import { Add, Remove } from "@suid/icons-material";
import {
  DragDropProvider,
  DragDropSensors,
  Droppable,
  createDraggable,
  createDroppable,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";

export interface Item {
  id: string;
  render: () => JSX.Element;
  canDrop?: (item: Item) => boolean;
  canDrag?: () => boolean;
  drop?: (sourceId: string, targetId: string) => void;
}

export interface Container extends Item {
  items: Item[];
  expanded: () => boolean;
  setExpanded: (value: boolean) => void;
}

interface TreeViewProps {
  items: Item[];
  level?: number;
}

// function isContainer(item: Item): item is Container {
//   return "items" in item && "expanded" in item;
// }
const SimpleItem: Component<{ item: Item; level: number }> = (props) => {
  const draggable = createDraggable(props.item.id);

  return (
    <Box
      sx={{ paddingLeft: `${props.level * 20 + 28}px`, marginTop: 0 }}
      class="draggable"
      ref={(el) => draggable(el)}
      style={{ "touch-action": "none" }}
    >
      <Box sx={{ display: "flex", alignItems: "center",  marginTop: 0 }}>
        {props.item.render()}
      </Box>
    </Box>
  );
};

const ContainerHeader: Component<{ item: Container; level: number }> = (
  props
) => {

  const draggable = createDraggable(props.item.id, { id: props.item.id });
  const droppable = createDroppable(props.item.id, { id: props.item.id });

  return (
    <Box
      sx={{
        position: "relative",
        paddingLeft: `${props.level * 20}px`,
      }}
      class="container-header"
    >
      <IconButton
        size="small"
        onClick={() => props.item.setExpanded(!props.item.expanded())}
        sx={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {props.item.expanded() ? <Remove /> : <Add />}
      </IconButton>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "4px",
          paddingLeft: "28px",
          border: "2px solid transparent",
          transition: "border-color 0.2s ease",
        }}
      >
        <div
          class="draggable droppable"
          classList={{ "!droppable-accept": droppable.isActiveDroppable }}
          ref={(el) => {
            props?.item?.canDrag && props?.item?.canDrag() && draggable(el);
            droppable(el);
          }}
          style={{
            "border": "2px solid transparent",
            "transition": "all 0.2s ease",
            "position": "relative",
            "touch-action": "none"
          }}
        >
          {props.item.render()}
        </div>
      </Box>
    </Box>
  );
};

type ItemFunc = () => JSX.Element;

function Item(items: ItemFunc[]) {
  return <For each={items}>{(item) => item()}</For>;
}

const TreeItem: Component<{ item: Item; level: number }> = (props) => {
  if (!isContainer(props.item)) {
    return <SimpleItem item={props.item} level={props.level} />;
  }

  return (
    <>
      <ContainerHeader item={props.item} level={props.level} />
      <Show when={props.item.expanded()}>
        <For each={props.item.items}>
          {(childItem) =>
            isContainer(childItem) ? (
              <>
                <ContainerHeader item={childItem} level={props.level + 1} />
                {childItem.expanded() &&
                  childItem.items.map((item) => (
                    <SimpleItem item={item} level={props.level + 2} />
                  ))}
              </>
            ) : (
              <SimpleItem item={childItem} level={props.level + 1} />
            )
          }
        </For>
      </Show>
    </>
  );
};

export const TreeView: Component<TreeViewProps> = (props) => {
  const handleDragEnd = (e: any) => {
    const { draggable, droppable } = e;
    if (!draggable || !droppable) return;

    const sourceItem = findItemById(props.items, draggable.id);
    const targetContainer = findItemById(props.items, droppable.id);    
    const canDrop = targetContainer && sourceItem && targetContainer?.canDrop?.(sourceItem) || false;

    if (sourceItem && targetContainer && canDrop) {
      targetContainer?.drop && targetContainer?.drop( draggable.id,  droppable.id);
    } else {
      console.log('Cannot drop item:', sourceItem?.id, 'to container:', targetContainer?.id);
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <DragDropSensors>
        <Stack spacing={1}>
          <For each={props.items}>
            {(item) => <TreeItem item={item} level={props.level || 0} />}
          </For>
        </Stack>
      </DragDropSensors>
    </DragDropProvider>
  );
};

function findItemById(items: Item[], id: string): Item | null {
  for (const item of items) {
    if (item.id === id) return item;
    console.log('not found with id, item:', id, item.id);
    if (isContainer(item)) {
      const found = findItemById(item.items, id);
      if (found) return found;
    }
  }
  return null;
}

// Type guard for Container
function isContainer(item: Item): item is Container {
  return 'items' in item && Array.isArray(item.items);
}
