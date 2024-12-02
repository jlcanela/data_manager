// src/pages/DatabaseExplorer.tsx
import { createSignal, For, Show } from "solid-js";
import {
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
} from "@suid/material";
import { SchemaInfo } from "./database";
import { getDatabaseFixtures } from "./databaseFixtures";
import SelectionList from "./SelectionList";

const DatabaseExplorer = () => {
  const schemas = getDatabaseFixtures();
  const [selectedSchema, setSelectedSchema] = createSignal<string | null>(null);
  const [selectedTable, setSelectedTable] = createSignal<string | null>(null);

  const currentSchema: () => SchemaInfo | undefined = () =>
    schemas.find((s) => s.name === selectedSchema());

  const currentTable = () =>
    currentSchema()?.tables.find((t) => t.name === selectedTable());

  const tables = schemas.flatMap((schema) => schema.tables);

  const handleSchemaChange = (value: string) => {
    setSelectedSchema(value);
    setSelectedTable(null);
  };

  const [selectedSchemas, setSelectedSchemas] = createSignal<Set<string>>(
    new Set()
  );

  const toggleSchema = (schema: string) => {
    const currentSelected = new Set(selectedSchemas());
    if (currentSelected.has(schema)) {
      currentSelected.delete(schema);
    } else {
      currentSelected.add(schema);
    }
    setSelectedSchemas(currentSelected);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Database Explorer
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Database Schemas
          </Typography>
          <SelectionList
            selected={selectedSchemas()}
            items={schemas.map((schema) => schema.name)}
            toggle={toggleSchema}
            multiSelect={true}
          />
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tables
          </Typography>
          <SelectionList
            items={tables.map((table) => table.name)}
            selected={selectedTable() ? new Set(selectedTable()) : new Set()}
            toggle={toggleSchema}
            multiSelect={false}
          />
        </Paper>
      </Box>
    

      <Show when={currentTable()}>
        {(table) => (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Column</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Nullable</TableCell>
                  <TableCell>Key Type</TableCell>
                  <TableCell>References</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={table().fields}>
                  {(field) => (
                    <TableRow>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>{field.nullable ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {field.name === table().primaryKey
                          ? "Primary Key"
                          : table().foreignKeys.some(
                              (fk) => fk.columnName === field.name
                            )
                          ? "Foreign Key"
                          : ""}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const fk = table().foreignKeys.find(
                            (fk) => fk.columnName === field.name
                          );
                          return fk
                            ? `${fk.referencedTable}.${fk.referencedColumn}`
                            : "";
                        })()}
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Show>
    </Box>
  );
};

export default DatabaseExplorer;
