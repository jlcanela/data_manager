declare module "solid-js" {
  namespace JSX {
    interface Directives {
      draggable: boolean;
      droppable: boolean;
    }
  }
}

import { Checkbox, FormControlLabel, styled } from "@suid/material";
import { createSignal, For, Show } from "solid-js";
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

import "./JsonViewer.css";

import { Field, FieldType, Structure } from "./Metamodel";

// Example usage

// @perplexityai please add new items in the schema so that I have all renderfield types

const ProjectSchema: Structure = {
  id: "project",
  title: "Project Schema",
  description: "Defines the structure of a project",
  constraints: {
    required: ["name", "createdAt"],
    additionalProperties: false
  },
  fields: [
    {
      name: "name",
      type: { 
        name: "string",
        constraints: {
          minLength: 1,
          maxLength: 100,
          pattern: "^[a-zA-Z0-9-_]+$"
        }
      },
      description: "Project name"
    },
    {
      name: "status",
      type: {
        enum: ["draft", "active", "archived"]
      },
      default: "draft"
    },
    {
      name: "tags",
      type: {
        type: { name: "string" },
        isArray: true,
        constraints: {
          minItems: 0,
          maxItems: 10,
          uniqueItems: true
        }
      }
    },
    {
      name: "createdAt",
      type: {
        name: "string",
        constraints: {
          format: "date-time"
        }
      },
      readOnly: true
    },
    {
      name: "configuration",
      type: {
        oneOf: [
          { name: "string" },
          { structure: "ConfigObject" }
        ]
      }
    },
    {
      name: "priority",
      type: {
        allOf: [
          { name: "integer" },
          { name: "number", constraints: { minimum: 1, maximum: 5 } }
        ]
      },
      description: "Priority level"
    },
    {
      name: "options",
      type: {
        anyOf: [
          { name: "string" },
          { name: "number" },
          { structure: "OptionObject" }
        ]
      },
      description: "Various options"
    },
    {
      name: "notExample",
      type: {
        not: { name: "null" }
      },
      description: "Should not be null"
    },
    {
      name: "conditionalField",
      type: {
        if: { name: "string" },
        then: { name: "number" },
        else: { name: "boolean" }
      },
      description: "Conditional field example"
    },
    {
      name: "referenceField",
      type: {
        structure: "ConfigObject"
      },
      description: "Reference to ConfigObject"
    },
    {
      name: "enumField",
      type: {
        enum: ["option1", "option2", "option3"]
      },
      description: "Enum field example"
    },
    {
      name: "arrayField",
      type: {
        type: { name: "number" },
        isArray: true,
        constraints: {
          minItems: 1,
          maxItems: 5
        }
      },
      description: "Array of numbers"
    }
  ],
  definitions: {
    ConfigObject: {
      id: "configObject",
      fields: [
        {
          name: "setting1",
          type: { name: "string" }
        },
        {
          name: "setting2",
          type: { name: "number" }
        }
      ]
    },
    OptionObject: {
      id: "optionObject",
      fields: [
        {
          name: "option1",
          type: { name: "string" }
        },
        {
          name: "option2",
          type: { name: "boolean" }
        }
      ]
    }
  }
}

// Modified component props
interface JsonItemProps {
  id: string;
  depth: number;
  color: string;
  children?: any;
}

interface JsonNodeProps {
  data: Structure | Field;
  depth?: number;
  path?: string[];
}

// Styled components remain the same
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
  
  const Item = styled("div")<JsonItemProps>((props) => ({
    margin: "4px 0",
    padding: "6px 12px",
    borderRadius: "4px",
    backgroundColor: props.props.color,
    marginLeft: `${props.props.depth * 20}px`,
    display: "block",
    maxWidth: "300px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    width: "fit-content",
    userSelect: "none",
  }));

  return (
    <Item 
      ref={el => {
        draggable(el);
        droppable(el);
      }}
      class="draggable droppable"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
      id={props.id}
      depth={props.depth}
      color={props.color}
    >
      {props.children}
    </Item>
  );
};

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

  const renderFieldType = (type: FieldType, name: string): string => {
    if ('name' in type) {  // SimpleType
      return `${name}: ${type.name}${type.constraints ? ` (${JSON.stringify(type.constraints)})` : ''}`;
    }
    
    if ('structure' in type) {  // ReferenceType
      return `${name}: ${type.structure}${type.isArray ? '[]' : ''}`;
    }
    
    if ('type' in type) {  // ArrayType
      const innerType = renderFieldType(type.type, '').split(': ')[1];
      return `${name}: Array<${innerType}>${type.constraints ? ` (${JSON.stringify(type.constraints)})` : ''}`;
    }
    
    if ('enum' in type) {  // EnumType
      return `${name}: enum(${type.enum.join(' | ')})`;
    }
    
    if ('oneOf' in type) {  // UnionType
      const types = type.oneOf.map(t => renderFieldType(t, '').split(': ')[1]);
      return `${name}: oneOf(${types.join(' | ')})`;
    }
    
    if ('allOf' in type) {  // AllOfType
      const types = type.allOf.map(t => renderFieldType(t, '').split(': ')[1]);
      return `${name}: allOf(${types.join(' & ')})`;
    }
    
    if ('anyOf' in type) {  // AnyOfType
      const types = type.anyOf.map(t => renderFieldType(t, '').split(': ')[1]);
      return `${name}: anyOf(${types.join(' | ')})`;
    }
    
    if ('not' in type) {  // NotType
      const innerType = renderFieldType(type.not, '').split(': ')[1];
      return `${name}: not(${innerType})`;
    }
    
    if ('if' in type) {  // ConditionalType
      const ifType = renderFieldType(type.if, '').split(': ')[1];
      const thenType = type.then ? renderFieldType(type.then, '').split(': ')[1] : '';
      const elseType = type.else ? renderFieldType(type.else, '').split(': ')[1] : '';
      return `${name}: if(${ifType}) then(${thenType}) else(${elseType})`;
    }
    
    return `${name}: unknown`;
  };

  const renderField = (field: Field) => {
    const currentPath = [...(props.path || []), field.name];
    const metadata = [];
    
    if (field.deprecated) metadata.push('deprecated');
    if (field.readOnly) metadata.push('readOnly');
    if (field.writeOnly) metadata.push('writeOnly');
    if (field.default !== undefined) metadata.push(`default=${JSON.stringify(field.default)}`);
    if (field.isRequired) metadata.push('required');  // New condition
    
    const displayText = renderFieldType(field.type, field.name);
    const metadataText = metadata.length > 0 ? ` [${metadata.join(', ')}]` : '';
    const descriptionText = field.description ? ` // ${field.description}` : '';

    return (
      <NodeWrapper>
        <JsonItem id={field.name} depth={depth} color={getColor(depth)}>
          {displayText}{metadataText}{descriptionText}
        </JsonItem>
      </NodeWrapper>
    );
  };

  const renderStructure = (structure: Structure) => {
    return (
      <NodeWrapper>
        <JsonItem id={structure.id} depth={depth} color={getColor(depth)}>
          {structure.title || structure.id}{structure.description ? ` // ${structure.description}` : ''}
        </JsonItem>
        <For each={structure.fields}>
          {(field) => renderField(field)}
        </For>
        {structure.definitions && (
          <Show when={Object.keys(structure.definitions).length > 0}>
            <JsonItem id="definitions" depth={depth} color={getColor(depth)}>
              Definitions:
            </JsonItem>
            <For each={Object.entries(structure.definitions)}>
              {([key, def]) => (
                <JsonNode data={def} depth={depth + 1} path={[...props.path || [], 'definitions', key]} />
              )}
            </For>
          </Show>
        )}
      </NodeWrapper>
    );
  };

  return (
    <NodeWrapper>
      {'fields' in props.data ? 
        renderStructure(props.data as Structure) : 
        renderField(props.data as Field)}
    </NodeWrapper>
  );
};

const JsonViewer: Component<{ data: Structure }> = (props) => {
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
            onChange={() => setShowDebugger(!showDebugger())}
          />
        }
        label="Show DragDrop Debugger"
      />
      <DragDropProvider onDragEnd={handleDragEnd}>
        {showDebugger() && <DragDropDebugger/>}
        <DragDropSensors>
          <JsonContainer>
            <JsonNode data={ProjectSchema} path={[]} />
          </JsonContainer>
        </DragDropSensors>
      </DragDropProvider>
    </>
  );
};

export default JsonViewer;
