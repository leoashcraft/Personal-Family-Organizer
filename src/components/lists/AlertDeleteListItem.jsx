import React, { forwardRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDeleteListItem({ open, onClose, listItem }) {

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    >
    <DialogTitle>{"Continue?"}</DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        If you continue, list item and details will be deleted.
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Delete</Button>
    </DialogActions>
    </Dialog>
  );
}