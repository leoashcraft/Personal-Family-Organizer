import React from "react";
import { MenuItem, Divider } from "@mui/material";
import {
  Archive as ArchiveIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  LowPriority as LowPriorityIcon,
  PlaylistAdd as PlaylistAddIcon,
  SwapVert as SwapVertIcon
} from "@mui/icons-material";
import StyledMenu from "@/components/lists/StyledMenu";

const ListMenu = ({
  anchorEl,
  open,
  onClose,
  onAddListCat,
  onAddList,
  onReorderCats,
  onReorderLists,
}) => {
  return (
    <>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem
          onClick={() => {
            onClose();
          }}
          disableRipple
        >
          <EditIcon />
          Edit Category
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose();
          }}
          disableRipple
        >
          <DeleteIcon />
          Delete Category
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            onClose();
            onAddList();
          }}
          disableRipple
        >
          <PlaylistAddIcon />
          Add List
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose();
            onAddListCat();
          }}
          disableRipple
        >
          <CreateNewFolderIcon />
          Add Category
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            onClose();
            onReorderLists();
          }}
          disableRipple
        >
          <LowPriorityIcon />
          Reorder Lists
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose();
            onReorderCats();
          }}
          disableRipple
        >
          <SwapVertIcon />
          Reorder Categories
        </MenuItem>
      </StyledMenu>
    </>
  );
};
export default ListMenu;
