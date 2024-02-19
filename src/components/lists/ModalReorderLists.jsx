import React, { useRef } from "react";
import { Box, CircularProgress, FormGroup, Modal, Paper } from "@mui/material";
import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { useLists } from "@/components/lists/ListsContext";
import styles from "@/styles/Modals.module.scss";
import dynamic from "next/dynamic";

function ReorderListsModal({ open, onClose }) {
  // Dynamic imports for client-side only components
  const DragAndDrop = dynamic(
    () => import("@/components/drag-and-drop").then((mod) => mod.DragAndDrop),
    { ssr: false },
  );

  const Drag = dynamic(
    () => import("@/components/drag-and-drop").then((mod) => mod.Drag),
    { ssr: false },
  );

  const Drop = dynamic(
    () => import("@/components/drag-and-drop").then((mod) => mod.Drop),
    { ssr: false },
  );

  const ref = useRef();
  const { lists, updateListOrder, isItemLoading, setIsItemLoading, selectedCategory } = useLists();

  const filteredLists = lists.filter(list => list.listCategoryId === selectedCategory);

  const handleDragEnd = async (result) => {
    setIsItemLoading(true);
    if (!result.destination) {
      setIsItemLoading(false);
      return;
    }

    const reorderedLists = Array.from(filteredLists);
    const [reorderedItem] = reorderedLists.splice(result.source.index, 1);
    reorderedLists.splice(result.destination.index, 0, reorderedItem);

    try {
      await updateListOrder(reorderedLists, selectedCategory);
    } catch (error) {
      console.error(error);
    } finally {
      setIsItemLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div ref={ref}>
        <DragAndDrop onDragEnd={handleDragEnd}>
          <Paper className={styles.modalContainer}>
            <h2>Reorder Lists</h2>
            {!isItemLoading ? (
              <Drop id="reorder-lists" type="droppable-item">
                <FormGroup>
                  <hr />
                  {filteredLists
                    .filter(list => list.listCategoryId === selectedCategory)
                    .map((list, index) => (
                      <Drag
                        className={styles.listItem}
                        key={list.listId}
                        id={list.listId.toString()}
                        index={index}
                      >
                        <span className={styles.listItemText}>{list.listName}</span>
                        <DragHandleIcon />
                      </Drag>
                    ))}
                </FormGroup>
              </Drop>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress size="2.5rem" sx={{ color: "rgb(25,118,210)", mr: 2 }} />
              </Box>
            )}
          </Paper>
        </DragAndDrop>
      </div>
    </Modal>
  );
}
export default ReorderListsModal;