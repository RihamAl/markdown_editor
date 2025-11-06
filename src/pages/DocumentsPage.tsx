// src/pages/DocumentsPage.tsx
import { useEffect, useState } from "react";
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

import {
  fetchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../api/documents";
import DocumentForm from "../components/DocumentForm";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadDocuments();
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

  async function handleCreate(title: string, content: string) {
    try {
      const newDoc = await createDocument(title, content);
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

  return (
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
                      <Typography sx={{ whiteSpace: "pre-line" }}>
                        {doc.content}
                      </Typography>
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
  );
}
