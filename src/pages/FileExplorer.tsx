// pages/FileExplorer.tsx
import { Component, createEffect, createSignal } from "solid-js";

import { Folder, InsertDriveFile } from "@suid/icons-material";
import { Box, Paper, Typography } from "@suid/material";
import { Container, TreeView } from "../components/TreeView";
interface FileNode {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null;
  children: string[]; // array of child IDs
}

interface FileSystem {
  nodes: { [id: string]: FileNode };
}

// Sample data in new format
const sampleData: FileSystem = {
  nodes: {
    "root": {
      id: "root",
      name: "root",
      isFolder: true,
      parentId: null,
      children: ["file1", "doc1", "pic1"]
    },
    "file1": {
      id: "file1",
      name: "file.txt",
      isFolder: false,
      parentId: "root",
      children: []
    },
    "doc1": {
      id: "doc1",
      name: "documents",
      isFolder: true,
      parentId: "root",
      children: []
    },
    "pic1": {
      id: "pic1",
      name: "pictures",
      isFolder: true,
      parentId: "root",
      children: ["file2"]
    },
    "file2": {
      id: "file2",
      name: "file.txt",
      isFolder: false,
      parentId: "pic1",
      children: []
    }
  }
};

// Simplified moveTo function
function moveTo(sourceId: string, targetId: string, fs: FileSystem): FileSystem {
  if (sourceId === targetId) return fs;
  
  const newFs = { nodes: { ...fs.nodes } };
  const sourceNode = newFs.nodes[sourceId];
  const targetNode = newFs.nodes[targetId];
  
  if (!sourceNode || !targetNode || !targetNode.isFolder) return fs;
  
  // Remove from old parent's children
  if (sourceNode.parentId) {
    const oldParent = newFs.nodes[sourceNode.parentId];
    oldParent.children = oldParent.children.filter(id => id !== sourceId);
  }
  
  // Add to new parent's children
  targetNode.children.push(sourceId);
  
  // Update parent reference
  sourceNode.parentId = targetId;
  
  return newFs;
}

const FileExplorer: Component = () => {
  const [data, setData] = createSignal<FileSystem>(sampleData);
  const treeData = () => adapter(data());

// Adapter function to convert flat map to tree structure
function adapter(fs: FileSystem, nodeId: string = "root"): any {
  const node = fs.nodes[nodeId];
  
  if (node.isFolder) {
    const [expanded, setExpanded] = createSignal(true);
    
    return {
      id: nodeId,
      items: node.children.map(childId => adapter(fs, childId)),
      expanded,
      setExpanded,
      drop: (sourceId: string, targetId: string) => {
        setData(moveTo(sourceId, targetId, fs));
      },
      canDrop: () => true,
      canDrag: () => nodeId !== "root",
      render: () => (
        <Paper sx={{ display: "flex", gap: 1, padding: 1 }}>
          <Folder />
          <Typography>{node.name}</Typography>
        </Paper>
      ),
    } as Container;
  }

  return {
    id: nodeId,
    render: () => (
      <Paper sx={{ display: "flex", gap: 1, padding: 1 }}>
        <InsertDriveFile />
        <Typography>{node.name}</Typography>
      </Paper>
    ),
  };
}

  return (
    <>
      <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        File Explorer
      </Typography>
      <TreeView items={[treeData()]} />
    </Paper>
    <Paper sx={{ padding: 2, marginTop: 3 }}>
      <Typography variant="h6">Instructions</Typography>
      <Typography>
        Drag and drop folders and files to move them around.
      </Typography>
      </Paper>
      <Paper sx={{ padding: 2, marginTop: 3 }}>
        <pre>
          {JSON.stringify(data(), null, 2)}
        </pre>
        </Paper>
    </>

  );
};

export default FileExplorer;
