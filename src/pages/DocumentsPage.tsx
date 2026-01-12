// src/pages/DocumentsPage.tsx
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

import {
  fetchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../api/documents";
import DocumentForm from "../components/DocumentForm";
import DashboardNavBar from "../components/DashboardNavBar";


interface Document {
  id: string;
  title: string;
  content: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadDocuments(); // Load documents 
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error(err);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(title: string, content: string, file?: File) {
    try {
      const newDoc = await createDocument(title, content, file);
      setDocuments([...documents, newDoc]);
      setCreating(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create document");
    }
  }

  async function handleUpdate(title: string, content: string) {
    if (!editingDoc) return;
    try {
      const updated = await updateDocument(editingDoc.id, title, content);
      setDocuments(documents.map((d) => (d.id === updated.id ? updated : d)));
      setEditingDoc(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update document");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  }

  const downloadMarkdown = (filename: string, content: string) => {
      const file = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(file);    
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url); 
    }

  return (
    <>
    <DashboardNavBar />
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Documents
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {creating ? (
            <DocumentForm
              onSave={handleCreate}
              onCancel={() => setCreating(false)}
            />
          ) : editingDoc ? (
            <DocumentForm
              initialTitle={editingDoc.title}
              initialContent={editingDoc.content}
              onSave={handleUpdate}
              onCancel={() => setEditingDoc(null)}
            />
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCreating(true)}
                sx={{ mb: 2 }}
              >
                Create New Document
              </Button>

              {documents.length === 0 ? (
                <Typography>No documents yet.</Typography>
              ) : (
                documents.map((doc) => (
                  <Card key={doc.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{doc.title}</Typography>
                    
                      <MDEditor.Markdown source={doc.content} />

                      <Box sx={{ mt: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => setEditingDoc(doc)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => downloadMarkdown(doc.title + '.md', doc.content)} >
                            <DownloadIcon />
                          </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </>
          )}
        </>
      )}
    </Box>
</>  );
}
