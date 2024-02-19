import React from "react";
import { MenuItem } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import StyledMenu from "@/components/lists/StyledMenu";

const ListNameMenu = ({ anchorEl, open, onClose, onEdit, onDelete, listId }) => {
  
  const handleEdit = (e) => {
    e.stopPropagation();
    onClose();
    onEdit(listId);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onClose();
    onDelete(listId);
  };

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={handleEdit} disableRipple>
        <EditIcon />
        Edit
      </MenuItem>
      <MenuItem onClick={handleDelete} disableRipple>
        <DeleteIcon />
        Delete
      </MenuItem>
    </StyledMenu>
  );
};

export default ListNameMenu;