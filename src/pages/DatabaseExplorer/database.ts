// src/types/database.ts
export type Field = {
    name: string;
    type: string;
    nullable: boolean;
};

export type ForeignKey = {
    columnName: string;
    referencedTable: string;
    referencedColumn: string;
};

export type TableInfo = {
    name: string;
    fields: Field[];
    primaryKey: string;
    foreignKeys: ForeignKey[];
};

export type SchemaInfo = {
    name: string;
    tables: TableInfo[];
};
