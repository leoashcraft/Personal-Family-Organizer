import React, { useRef } from "react";
import { Box, CircularProgress, FormGroup, Modal, Paper } from "@mui/material";
import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { useLists } from "@/components/lists/ListsContext";
import styles from "@/styles/Modals.module.scss";
import dynamic from "next/dynamic";

function ReorderCatsModal({ open, onClose }) {
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

  const Drop = dynamic(
    () => import("@/components/drag-and-drop").then((mod) => mod.Drop),
    {
      ssr: false, // This will only import Drop on the client-side
    },
  );
  const ref = useRef();
  const { categories, updateCategoryOrder, isItemLoading, setIsItemLoading } = useLists();

  const handleDragEnd = async (result) => {
    setIsItemLoading(true);
    if (!result.destination) {
      setIsItemLoading(false);
      return;
    }
    const reorderedCategories = Array.from(categories);
    const [reorderedItem] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, reorderedItem);
    try {
console.log(reorderedCategories);
      await updateCategoryOrder(reorderedCategories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsItemLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div ref={ref}>
        <DragAndDrop onDragEnd={handleDragEnd
        }>
          <Paper className={styles.modalContainer}>
            <h2>Reorder Categories</h2>
            {!isItemLoading ? (
              <Drop id="reorder-categories" type="droppable-item">
                <FormGroup>
                  <hr />
                  {categories.map((cat, index) => (
                    <Drag
                      className={styles.listItem}
                      key={cat.categoryId}
                      id={cat.categoryId.toString()}
                      index={index}
                    >
                      <span className={styles.listItemText}>
                        {cat.categoryName}
                      </span>
                      <DragHandleIcon />
                    </Drag>
                  ))}
                </FormGroup>
              </Drop>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress
                  size="2.5rem"
                  sx={{ color: "rgb(25,118,210)", mr: 2 }}
                />
              </Box>
            )}
          </Paper>
        </DragAndDrop>
      </div>
    </Modal>
  );
}
export default ReorderCatsModal;
