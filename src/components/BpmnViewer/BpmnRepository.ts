export const jlcModdle = {
    name: "JLC",
    uri: "https://jlc",
    prefix: "jlc",
    xml: {
      tagAlias: "lowerCase",
    },
    types: [
      {
        name: "Properties",
        superClass: ["Element"],
        properties: [
          {
            name: "values",
            type: "Property",
            isMany: true,
          },
        ],
      },
      {
        name: "Property",
        superClass: ["Element"],
        properties: [
          {
            name: "name",
            type: "String",
            isAttr: true,
          },
          {
            name: "value",
            type: "String",
            isAttr: true,
          },
        ],
      },
    ],
  };

export function readCustomProperties(element) {
    const result = {
      input: null,
      output: null,
    };
  
    // Get extension elements from business object
    const businessObject = element.businessObject;
    const extensionElements = businessObject.extensionElements;
  
    if (!extensionElements || !extensionElements.values) {
      return result;
    }
  
    // Find our custom properties
    const jlcProperties = extensionElements.values.find(
      (extension) => extension.$type === "jlc:Properties"
    );
  
    if (!jlcProperties || !jlcProperties.values) {
      return result;
    }
  
    // Extract input and output values
    jlcProperties.values.forEach((prop) => {
      if (prop.name === "input") {
        try {
          result.input = JSON.parse(prop.value);
        } catch (e) {
          result.input = prop.value;
        }
      }
      if (prop.name === "output") {
        try {
          result.output = JSON.parse(prop.value);
        } catch (e) {
          result.output = prop.value;
        }
      }
    });
  
    return result;
  }
  
export function setCustomProperties(modeling, moddle, element, inputData, outputData) {
    // Create extension elements if they don't exist
    const extensionElements = moddle.create("bpmn:ExtensionElements", {
      values: [],
    });
  
    // Create properties container
    const properties = moddle.create("jlc:Properties");
  
    // Add input data
    const input = moddle.create("jlc:Property", {
      name: "input",
      value: JSON.stringify(inputData),
    });
  
    // Add output data
    const output = moddle.create("jlc:Property", {
      name: "output",
      value: JSON.stringify(outputData),
    });
  
    properties.values = [input, output];
    extensionElements.values = [properties];
  
    // Update the element with new properties
    modeling.updateProperties(element, {
      extensionElements: extensionElements,
    });
  
  }
  
export interface ShapeInfo {
  id: string;
  type: string;
  name: string;
  input: string;
  output: string;
  element?: any;
}

export function getShapeInfo(el: any, readCustomProperties): ShapeInfo {
  if (!el) {
    return undefined;
  }

  const id = el.id;
  const type = el.type;
  const label = el.businessObject.name || "No label";

  const { input, output } = readCustomProperties(el);

  return {
    id: id,
    type: type,
    name: label,
    input: input,
    output: output,
    element: el,
  };
}

export function getShape(e: any) {
  const selectedElements = e.newSelection;
  if (selectedElements.length > 0) {
    const firstElement = selectedElements[0];
    return firstElement;
  }
  return undefined;
}