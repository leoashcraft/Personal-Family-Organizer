import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Tooltip } from "@mui/material";
import * as Icons from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import { useModals } from "@/components/lists/ModalsContext";
import { useLists } from "@/components/lists/ListsContext";
import styles from "@/styles/Modals.module.scss";

function AddListCatModal({ open, onClose }) {
  const { selectedIcon, handleIconAnchorClick } = useModals();
  const { addCategory, setIsItemLoading } = useLists();
  const [categoryInput, setCategoryInput] = useState('');

  const handleSubmit = async () => {
    console.log(categoryInput);
    setIsItemLoading(true);
    try {
      await addCategory(categoryInput, selectedIcon);
    } catch (error) {
      console.error(error);
    } finally {
      setIsItemLoading(false);
    }
  };

  const IconComponent = Icons[selectedIcon] || Icons["AppShortcut"];

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <Paper className={styles.modalContainer}>
        <FormControl fullWidth>
          <h2 className={styles.modalTitle}>Add Category</h2>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Tooltip title={selectedIcon} arrow>
              <IconButton onClick={handleIconAnchorClick} aria-label="Select icon">
                <IconComponent style={{ fontSize: '45px' }} />
              </IconButton>
            </Tooltip>
            <TextField
              id="new-list-name"
              label="Enter a new category name"
              variant="outlined"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              style={{ margin: '20px' }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {categoryInput && (
                      <IconButton
                        onClick={() => setCategoryInput('')}
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
          </Box>
          <Button className={styles.modalButton} variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </FormControl>
      </Paper>
    </Modal>
  );
}

export default AddListCatModal;