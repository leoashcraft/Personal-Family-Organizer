import React, { useState } from "react";
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import {
  History as HistoryIcon,
  MoreTime as MoreTimeIcon,
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import styles from "@/styles/Modals.module.scss";

function ItemDetailsModal({ open, onClose, currentListItemMenu }) {
  const DragAndDrop = dynamic(
    () => import("@/components/drag-and-drop").then((mod) => mod.DragAndDrop),
    {
      ssr: false, // This will only import DragAndDrop on the client-side
    },
  );
  const Drag = dynamic(
    () => import("@/components/drag-and-drop").then((mod) => mod.Drag),
    {
      ssr: false, // This will only import Drag on the client-side
    },
  );

  // const handleListOrderChange = (result) => {
  //   // Logic to reorder 'lists' based on drag result
  //   // Example: Using a function to reorder lists
  //   const reorderedLists = reorderLists(
  //     lists,
  //     result.source.index,
  //     result.destination.index,
  //   );
  //   setLists(reorderedLists);
  // };

  // const reorderLists = (lists, startIndex, endIndex) => {
  //   const result = Array.from(lists);
  //   const [removed] = result.splice(startIndex, 1);
  //   result.splice(endIndex, 0, removed);

  //   // Update listOrder for each list
  //   result.forEach((list, index) => {
  //     list.listOrder = index;
  //   });

  //   return result;
  // };

  return (
    <Modal
      open={open}
      onClose={onClose}
      currentListItemMenu={currentListItemMenu}
      className={styles.modal}
    >
      <Paper className={styles.modalContainer}>
        {/* <FormControl fullwidth>
          <h2 className={styles.modalTitle}>Item Details:</h2>

          <DemoContainer
            components={[
              "DateTimePicker",
              "MobileDateTimePicker",
              "DesktopDateTimePicker",
              "StaticDateTimePicker",
            ]}
          >
            <DemoItem label="Mobile variant">
              <MobileDateTimePicker defaultValue={dayjs("2022-04-17T15:30")} />
            </DemoItem>
          </DemoContainer>
          <Button className={styles.modalButton} variant="contained">
            Submit
          </Button>
          <Chip
            icon={<MoreTimeIcon />}
            label={currentListItemMenu.itemCreationDate}
            variant="outlined"
          />
          <Chip
            icon={<HistoryIcon />}
            label={currentListItemMenu.itemLastModified}
            variant="outlined"
          />
        </FormControl> */}
      </Paper>
    </Modal>
  );
}
export default ItemDetailsModal;
