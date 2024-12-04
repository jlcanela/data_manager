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

// Core type definitions
export interface SimpleType {
    name: string;  // string, number, integer, boolean, null
    constraints?: NumberConstraints & StringConstraints;
}

export interface Structure {
    id: string;
    title?: string;
    description?: string;
    fields: Field[];
    constraints?: ObjectConstraints;
    definitions?: { [key: string]: Structure };
}

export interface ArrayType {
    type: SimpleType | Structure;
    isArray: boolean;
    constraints?: ArrayConstraints;
}

// Enumeration type
export interface EnumType {
    enum: any[];         // List of possible values
    description?: string; // Description of the enumeration
}

// Reference to another structure
export interface ReferenceType {
    structure: string;   // ID of referenced structure
    isArray?: boolean;   // Whether it's an array of referenced type
}

export interface UnionType {
    oneOf: FieldType[];
    description?: string;
}

export interface AllOfType {
    allOf: FieldType[];
    description?: string;
}

export type FieldType = SimpleType
    | ArrayType
    | UnionType
    | AllOfType
    | EnumType
    | ReferenceType;

export interface Field {
    name: string;
    type: FieldType;
    title?: string;
    description?: string;
    default?: any;
    examples?: any[];
    deprecated?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    isRequired?: boolean;
}

