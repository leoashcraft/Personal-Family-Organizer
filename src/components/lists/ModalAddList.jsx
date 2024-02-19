import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useLists } from "@/components/lists/ListsContext";
import styles from "@/styles/Modals.module.scss";

function AddListModal({ open, onClose, categories , selectedCategory }) {
  const { addList, setIsItemLoading } = useLists();
  const [categoryInput, setCategoryInput] = useState('');
  const [listInput, setListInput] = useState('');


  const handleChange = (event) => {
    setCategoryInput(event.target.value);
  };

  const handleSubmit = async () => {
    setIsItemLoading(true);
    try {
      await addList(categoryInput, listInput);
    } catch (error) {
      console.error(error);
    } finally {
      setIsItemLoading(false);
    }
  };

  useEffect(() => {
    setCategoryInput(selectedCategory);
  }, [selectedCategory, open]);

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <Paper className={styles.modalContainer}>
        <FormControl fullWidth>
          <h2 className={styles.modalTitle}>Add List</h2>
          <InputLabel
            id="demo-simple-select-autowidth-label"
            sx={{ marginTop: "43px" }}
          >
            Category
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={categoryInput}
            onChange={handleChange}
            autoWidth
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </Select>
          <TextField
            id="new-list-name"
            label="Enter a new list name"
            variant="outlined"
            value={listInput}
            onChange={(e) => setListInput(e.target.value)}
            margin="normal"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {listInput && (
                    <IconButton
                      onClick={() => setListInput('')}
                      edge="end"
                      aria-label="clear search"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Button className={styles.modalButton} variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}
export default AddListModal;
