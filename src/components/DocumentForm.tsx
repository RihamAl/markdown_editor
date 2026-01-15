import { useState } from "react";
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { translateText, fixGrammarErrors, languages } from "../api/ai";
import TranslateIcon from "@mui/icons-material/Translate";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

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
  const [translateDialog, setTranslateDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [loading, setLoading] = useState(false);

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

  const handleTranslate = async () => {
    if (!content.trim()) {
      alert("Please add content to translate");
      return;
    }
    
    try {
      setLoading(true);
      const translated = await translateText(content, selectedLanguage);
      setContent(translated);
      setTranslateDialog(false);
      alert("Content translated successfully!");
    } catch {
      alert("Failed to translate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFixGrammar = async () => {
    if (!content.trim()) {
      alert("Please add content to fix");
      return;
    }

    try {
      setLoading(true);
      const corrected = await fixGrammarErrors(content);
      setContent(corrected);
      alert("Grammar check completed!");
    } catch {
      alert("Failed to check grammar. Please try again.");
    } finally {
      setLoading(false);
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
      </div>

      {/* AI Buttons */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button 
          variant="outlined" 
          startIcon={<TranslateIcon />}
          onClick={() => setTranslateDialog(true)}
          disabled={loading}
        >
          Translate
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<SpellcheckIcon />}
          onClick={handleFixGrammar}
          disabled={loading || !content.trim()}
        >
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : "Fix Grammar"}
        </Button>
        <Button variant="outlined" component='label'>
          Upload Markdown File {selectedFile && `(${selectedFile.name})`}
          <input
            type="file"
            accept=".md,.markdown"
            hidden
            onChange={handleFileUploaded}
        />
        </Button>
      </Box>

      {/* Translate Dialog */}
      <Dialog open={translateDialog} onClose={() => setTranslateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Translate Content</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Target Language</InputLabel>
            <Select
              value={selectedLanguage}
              label="Target Language"
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTranslateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleTranslate} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? "Translating..." : "Translate"}
          </Button>
        </DialogActions>
      </Dialog>

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
