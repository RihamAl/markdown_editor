import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";

interface Props {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string, file?: File) => void;
  onCancel?: () => void;
}

export default function DocumentForm({ initialTitle = "", initialContent = "", onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, content, selectedFile || undefined);
  };

  const handleFileUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result; 
        if (typeof fileContent === "string") {
          setContent(fileContent);
        }
      };
      reader.readAsText(file);
    }
  };

  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <div data-color-mode="light">
         <MDEditor value={content} onChange={(value) => setContent(value || "")} />
        <Button variant="outlined" component='label'>
          Upload Markdown File {selectedFile && `(${selectedFile.name})`}
          <input
            type="file"
            accept=".md,.markdown"
            hidden
            onChange={handleFileUploaded}
        />
        </Button>
      </div>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}
