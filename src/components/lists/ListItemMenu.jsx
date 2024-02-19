import React from "react";
import { Menu, MenuItem, Divider, styled, alpha } from "@mui/material";
import { Delete as DeleteIcon, Info as InfoIcon } from "@mui/icons-material";
import StyledMenu from "@/components/lists/StyledMenu";


const ListItemMenu = ({ anchorEl, open, onClose, onDelete, onItemDetails, listItem }) => {

const handleDelete = (e) => {
  e.stopPropagation();
  onClose();
  onDelete(listItem);
};

  return (
    <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={onClose} disableRipple>
        <InfoIcon />
        Item Details
      </MenuItem>
      <MenuItem onClick={handleDelete} disableRipple>
        <DeleteIcon />
        Delete Item
      </MenuItem>
    </StyledMenu>
  );
};
export default ListItemMenu;
