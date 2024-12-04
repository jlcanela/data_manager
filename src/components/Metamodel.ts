
// Numeric value constraints
export interface NumberConstraints {
  minimum?: number;          // Minimum value (inclusive)
  maximum?: number;          // Maximum value (inclusive)
  exclusiveMinimum?: number; // Minimum value (exclusive)
  exclusiveMaximum?: number; // Maximum value (exclusive)
  multipleOf?: number;       // Value must be a multiple of this number
}

// String value constraints
export interface StringConstraints {
  minLength?: number;     // Minimum string length
  maxLength?: number;     // Maximum string length
  pattern?: string;       // Regular expression pattern
  format?: string;        // Predefined formats: date-time, date, time, email, uri, uuid, etc.
}

// Array constraints
export interface ArrayConstraints {
  minItems?: number;      // Minimum number of items in array
  maxItems?: number;      // Maximum number of items in array
  uniqueItems?: boolean;  // Whether array items must be unique
}

// Object constraints
export interface ObjectConstraints {
  minProperties?: number;         // Minimum number of properties
  maxProperties?: number;         // Maximum number of properties
  required?: string[];           // List of required property names
  additionalProperties?: boolean; // Whether additional properties are allowed
}

// Basic type definition with constraints
export interface SimpleType {
  name: string;  // Basic types: string, number, integer, boolean, null
  constraints?: NumberConstraints & StringConstraints; // Combined constraints for the type
}

// Complex structure definition (object)
export interface Structure {
  id: string;                                // Unique identifier for the structure
  title?: string;                           // Human-readable title
  description?: string;                     // Detailed description
  fields: Field[];                          // List of fields in the structure
  constraints?: ObjectConstraints;          // Object-level constraints
  definitions?: { [key: string]: Structure }; // Reusable sub-structures
}

// Array type definition
export interface ArrayType {
  type: SimpleType | Structure;  // Type of array elements
  isArray: boolean;             // Flag indicating array type
  constraints?: ArrayConstraints; // Array-specific constraints
}

// Reference to another structure
export interface ReferenceType {
  structure: string;   // ID of referenced structure
  isArray?: boolean;   // Whether it's an array of referenced type
}

// Enumeration type
export interface EnumType {
  enum: any[];         // List of possible values
  description?: string; // Description of the enumeration
}

// Union type (oneOf) - value must match exactly one of the schemas
export interface UnionType {
  oneOf: FieldType[];   // List of possible types
  description?: string; // Description of the union
}

// Intersection type (allOf) - value must match all schemas
export interface AllOfType {
  allOf: FieldType[];   // List of types to combine
  description?: string; // Description of the intersection
}

// Any of type - value must match at least one schema
export interface AnyOfType {
  anyOf: FieldType[];   // List of possible types
  description?: string; // Description of the options
}

// Negation type - value must not match the schema
export interface NotType {
  not: FieldType;      // Type to negate
  description?: string; // Description of the negation
}

// Conditional validation
export interface ConditionalType {
  if: FieldType;      // Condition to test
  then?: FieldType;   // Schema to apply if condition is true
  else?: FieldType;   // Schema to apply if condition is false
}

// Union of all possible field types
export type FieldType = SimpleType 
  | ReferenceType 
  | ArrayType 
  | EnumType 
  | UnionType 
  | AllOfType 
  | AnyOfType 
  | NotType 
  | ConditionalType;

// Field definition
export interface Field {
  name: string;         // Field name
  type: FieldType;      // Field type (any of the above types)
  title?: string;       // Human-readable title
  description?: string; // Detailed description
  default?: any;        // Default value
  examples?: any[];     // Example values
  deprecated?: boolean; // Whether the field is deprecated
  readOnly?: boolean;   // Whether the field is read-only
  writeOnly?: boolean;  // Whether the field is write-only
}
