import { useEffect, useState, useRef, createRef } from "react";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormGroup,
  IconButton,
  Input,
  Paper,
  Tab,
  Tabs,
  TextField
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import styles from "@/styles/Home.module.scss";
import { getCommonServerSideProps } from "@/utils/auth";
import { getCategoriesAndLists, updateItem } from "@/utils/lists-api";
import ListMenu from "@/components/lists/ListMenu";
import ListNameMenu from "@/components/lists/ListNameMenu";
import ListItemMenu from "@/components/lists/ListItemMenu";
import { useDragState } from "@/components/drag-and-drop/DragStateContext";
import { useLists } from "@/components/lists/ListsContext";
import { useAlerts } from "@/components/lists/AlertsContext";
import { useModals } from "@/components/lists/ModalsContext";
import dynamic from "next/dynamic";


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

export async function getServerSideProps(context) {
  const result = await getCommonServerSideProps(context);

  if ("redirect" in result) {
    return result;
  }
  return {
    props: { session: result.props.session },
  };
}

function renderIcon(iconName, style = {}, onClick = null) {
  const IconComponent = Icons[iconName];

  if (IconComponent) {
    return <IconComponent style={style} onClick={onClick} />;
  } else return <Icons.DefaultIcon style={style} onClick={onClick} />;
}

function Lists({ session }) {
  const {
    lists,
    setLists,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedList,
    setSelectedList,
    isLoading,
    setIsLoading,
    isItemLoading,
    setIsItemLoading,
    addListItem,
    fetchListsAndCategoriesUpdate } = useLists();
    const {
      AlertDeleteList,
      isAlertOpenDeleteList,
      setIsAlertOpenDeleteList,
      openAlertDeleteList,
      handleCloseAlertDeleteList,
      AlertDeleteListItem,
      isAlertOpenDeleteListItem,
      setIsAlertOpenDeleteListItem,
      openAlertDeleteListItem,
      handleCloseAlertDeleteListItem
    } = useAlerts();
    const {
      ModalAddList,
      ModalAddListCat,
      ModalReorderLists,
      ModalReorderCats,
      ModalIconSelector,
      ModalItemDetails,
      isModalOpenAddList,
      isModalOpenAddListCat,
      isModalOpenReorderCats,
      isModalOpenReorderLists,
      isModalOpenIconSelector,
      isModalOpenItemDetails,
      openModalAddList,
      openModalAddListCat,
      openModalReorderCats,
      openModalReorderLists,
      openModalItemDetails,
      openModalIconSelector,
      handleCloseModalAddList,
      handleCloseModalAddListCat,
      handleCloseModalReorderCats,
      handleCloseModalReorderLists,
      handleCloseModalIconSelector,
      handleCloseModalItemDetails
    } = useModals();
  const { startDrag, endDrag } = useDragState();
  const [listAnchor, setListAnchor] = useState(null);
  const [listNameAnchor, setListNameAnchor] = useState(null);
  const [listItemAnchor, setListItemAnchor] = useState(null);
  const openListMenu = Boolean(listAnchor);
  const openListItemMenu = Boolean(listItemAnchor);
  const openListNameMenu = Boolean(listNameAnchor);
  const [currentListItemMenu, setCurrentListItemMenu] = useState(null);
  const [currentListNameMenu, setCurrentListNameMenu] = useState(0);
  const [editListNameMode, setEditListNameMode] = useState({});
  const [editListItemMode, setEditListItemMode] = useState({});
  const [editListItemModeValue, setEditListItemModeValue] = useState({});
  const [addItemInputs, setAddItemInputs] = useState('');
  const inputRefs = useRef({});

  const handleListAnchorClick = (event, listId) => {
    event.stopPropagation();
    setListAnchor(event.currentTarget);
  };

  const handleListNameAnchorClick = (event, listId) => {
    event.stopPropagation();
    setCurrentListNameMenu(listId);
    setListNameAnchor(event.currentTarget);
  };

  const handleListItemAnchorClick = (event, listItem) => {
    event.stopPropagation();
    setListItemAnchor(event.currentTarget);
    setCurrentListItemMenu(listItem);
  };

  const handleListAnchorClose = () => {
    setListAnchor(null);
  };

  const handleListNameAnchorClose = () => {
    setListNameAnchor(null);
  };

  const handleListItemAnchorClose = () => {
    setListItemAnchor(null);
  };

  const toggleEditListItemMode = (itemId) => {
    setEditListItemMode((prevState) => {
      const isEditListItemMode = !prevState[itemId];

      if (isEditListItemMode && !inputRefs.current[itemId]) {
        inputRefs.current[itemId] = createRef();
      }

      return {
        ...prevState,
        [itemId]: isEditListItemMode,
      };
    });
  };

  const handleExitEditListItemMode = (listId, itemId, itemOrder) => {
    const currentName = editListItemModeValue[itemId] ?? "";
    const originalName = lists
      .find((list) => list.listId === listId)
      .items.find((item) => item.itemId === itemId).itemName;
    if (currentName !== originalName) {
      updateItem(currentName, itemOrder, listId, itemId).then(() => {
        setEditListItemMode({ ...editListItemMode, [itemId]: false });
      });
    } else {
      setEditListItemMode({ ...editListItemMode, [itemId]: false });
    }
  };

  const handleEnterListNameEditMode = (listId) => {
    setEditListNameMode((prev) => ({ ...prev, [listId]: true }));
  };

  const handleExitListNameEditMode = (listId) => {
    setEditListNameMode((prev) => ({ ...prev, [listId]: false }));
  };

  const handleListNameChange = (e, listId) => {
    const newName = e.target.value;
    updateListNameInState(listId, newName);
  };

  const updateListNameInState = (listId, newName) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.listId === listId) {
          return { ...list, listName: newName };
        }
        return list;
      }),
    );
  };

  const handleItemNameChange = (e, itemId) => {
    const newName = e.target.value;
    setEditListItemModeValue((prevValues) => ({
      ...prevValues,
      [itemId]: newName,
    }));
  };

  const handleListItemClick = (listItem) => {
    setCurrentListItemMenu(listItem);
    openAlertDeleteListItem();
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const filteredLists = lists.filter(list => list.listCategoryId === selectedCategory);

  const handleDragStart = (start) => {
    startDrag(start.type);
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    setIsItemLoading(true);

    if (!destination || !source) {
      setIsItemLoading(false);
      return;
    }

    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    const sourceList = lists.find(list => list.listId.toString() === sourceListId);
    const destinationList = lists.find(list => list.listId.toString() === destinationListId);

    if (!sourceList || !destinationList) {
      setIsItemLoading(false);
      return;
    }

    const [removed] = sourceList.items.splice(source.index, 1);

    destinationList.items.splice(destination.index, 0, removed);

    const updatedLists = lists.map((list) => {
      if (list.listId === sourceListId) {
        return { ...list, items: sourceList.items };
      } else if (list.listId === destinationListId) {
        return { ...list, items: destinationList.items };
      }
      return list;
    });

    setLists(updatedLists);

    try {
      await updateListOrderInDatabase(sourceList);
      await updateListOrderInDatabase(destinationList);
    } catch (error) {
      /* */
    } finally {
      setIsItemLoading(false);
    }
  };

  const updateListOrderInDatabase = async (list) => {
    if (list.items && list.items.length > 0) {
      const updatePromises = list.items.map((item, index) => {
        return updateItem(item.itemName, index, list.listId, item.itemId);
      });

      await Promise.all(updatePromises);
    }
    setIsItemLoading(false);
  };

  useEffect(() => {
    if (!session) {
      signIn();
    } else {
      if (lists.length === 0 || categories.length === 0) setIsLoading(true);
      const fetchData = async () => {
        try {
          await fetchListsAndCategoriesUpdate();
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      console.log('Edit List Name Mode:', editListNameMode);
      Object.entries(editListItemMode).forEach(([itemId, isEditing]) => {
        if (isEditing && inputRefs.current[itemId]) {
          setTimeout(() => {
            inputRefs.current[itemId]?.current?.focus();
          }, 0);
        }
      });
    }
  }, [editListItemMode, session]);

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="categories"
          sx={{ flexGrow: 1 }} // Ensure tabs take available space
        >
          {categories.map((cat) => (
            <Tab
              key={cat.categoryId}
              icon={renderIcon(cat.categoryIcon)}
              value={cat.categoryId}
              label={cat.categoryName}
              aria-label={cat.categoryName}
            />
          ))}
        </Tabs>
        {!isItemLoading ? (
          <Box>
            <IconButton
              onClick={(e) => handleListAnchorClick(e)}
              aria-label="..."
            >
              {renderIcon("MoreVert", { fontSize: 44 })}
            </IconButton>
          </Box>
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
      <Paper
        sx={{
          bgcolor: "rgba(255 , 255, 255, 0.5)",
          borderRadius: "0 0 10px 10px",
          height: `calc(100vh - 222px)`,
          overflowY: "auto",
        }}
      >
        {!isLoading ? (
          <DragAndDrop onDragEnd={handleDragEnd}>
            <div className={styles.listsRow}>
              {filteredLists.map((list, index) => {
                return (
                  <div key={list.listId} className={styles.draggableList}>
                    <Paper className={styles.listContainer}>
                      {editListNameMode[list.listId] ? (
                        <h2>
                          <input
                            style={{ color: "rgb(25,118,210)" }}
                            ref={inputRefs.current[list.listId]}
                            defaultValue={list.listName}
                            onBlur={() =>
                              handleExitListNameEditMode(list.listId)
                            }
                            onChange={(e) =>
                              handleListNameChange(e, list.listId)
                            }
                            autoFocus
                          />
                        </h2>
                      ) : (
                        <h2
                          className={styles.listName}
                          onClick={() => {
                            setCurrentListNameMenu(list.listId);
                            handleEnterListNameEditMode(list.listId);
                          }}
                        >
                          {list.listName}
                          <IconButton
                            onClick={(e) => {
                              setCurrentListNameMenu(list.listId);
                              handleListNameAnchorClick(e, list.listId)
                            }}
                            aria-label="..."
                          >
                            {renderIcon("MoreVert", {
                              color: "rgba(102, 102, 102, 0.25)",
                            })}
                          </IconButton>
                        </h2>
                      )}

                      <Drop
                        id={list.listId.toString()}
                        key={list.listId}
                        type="droppable-item"
                      >
                        <FormGroup style={{ flex: 1, alignSelf: 'flex-start' }}>
                          <hr
                            style={{
                              height: "1px",
                              backgroundColor: "rgba(102, 102, 102, 0.1)",
                              border: "none",
                            }}
                          />
                          {list.items.map((listItem, index) => (
                            <Drag
                              key={listItem.itemId}
                              id={listItem.itemId.toString()}
                              index={index}
                            >
                              <div className={styles.listItem}>
                                <Checkbox
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                />
                                {editListItemMode[listItem.itemId] ? (
                                  <input
                                    style={{ color: "rgb(25,118,210)" }}
                                    className={styles.listItemText}
                                    ref={inputRefs.current[listItem.itemId]}
                                    defaultValue={listItem.itemName}
                                    onBlur={() =>
                                      handleExitEditListItemMode(
                                        list.listId,
                                        listItem.itemId,
                                        listItem.itemOrder,
                                      )
                                    }
                                    onChange={(e) =>
                                      handleItemNameChange(
                                        e,
                                        listItem.itemId,
                                        list.listId,
                                      )
                                    }
                                    autoFocus
                                  />
                                ) : (
                                  <span
                                    className={styles.listItemText}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleEditListItemMode(listItem.itemId);
                                    }}
                                  >
                                    {listItem.itemName}
                                  </span>
                                )}
                                <IconButton
                                  onClick={(e) =>
                                    handleListItemAnchorClick(e, listItem)
                                  }
                                  aria-label="..."
                                  className={styles.listItemIcon}
                                >
                                  {renderIcon("MoreVert", {
                                    color: "rgba(102, 102, 102, 0.25)",
                                  })}
                                </IconButton>
                              </div>
                              <hr
                                style={{
                                  height: "1px",
                                  backgroundColor: "rgba(102, 102, 102, 0.1)",
                                  border: "none",
                                }}
                              />
                            </Drag>
                          ))}
                        </FormGroup>
                      </Drop>
                      <Paper sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FAFAFA',
                        padding: '10px 12px',
                        border: '1px solid rgb(240, 240, 240)',
                        borderRadius: '4px',
                        boxShadow: 'inset 0 3px 12px -3px rgba(0,0,0,0.1)',
                        height: '42px',
                      }}>
                        <Input
                          fullWidth
                          placeholder="Add item..."
                          disableUnderline={true}
                          id={`add-item-field-${list.listId}`}
                          value={addItemInputs[list.listId] || ''}
                          onChange={(e) => {
                            const newItemInputValue = e.target.value;
                            setAddItemInputs(prev => ({ ...prev, [list.listId]: newItemInputValue }));
                          }}
                          sx={{
                            marginRight: '8px'
                          }}
                        />
                        {addItemInputs[list.listId] && (
                          <>
                            <IconButton
                              onClick={() => {
                                setIsItemLoading(true);
                                addListItem(list.listId, addItemInputs[list.listId]);
                                setAddItemInputs(prev => ({ ...prev, [list.listId]: '' }));
                              }}
                              edge="end"
                              aria-label="add item"
                            >
                              {renderIcon("AddCircle", { color: "rgba(102, 102, 102, 0.5)" })}
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setAddItemInputs(prev => ({ ...prev, [list.listId]: '' }));
                              }}
                              edge="end"
                              aria-label="clear input"
                            >
                              {renderIcon("Clear", { color: "rgba(102, 102, 102, 0.5)" })}
                            </IconButton>
                          </>
                        )}
                      </Paper>
                    </Paper>
                  </div>
                );
              })}
              <div className={styles.draggableList}>
                <Paper
                  className={styles.listContainer}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "150px",
                    width: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    border: 0,
                    boxShadow: 0,
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  {renderIcon("AddBox", { fontSize: 72 }, openModalAddList)}
                </Paper>
              </div>
            </div>
          </DragAndDrop>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size="15rem" sx={{ color: "#FFF" }} />
          </Box>
        )}
      </Paper>
      <ModalAddList
        open={isModalOpenAddList}
        onClose={handleCloseModalAddList}
        categories={categories}
        selectedCategory={selectedCategory}
      />
      <ModalAddListCat
        open={isModalOpenAddListCat}
        onClose={handleCloseModalAddListCat}
        onIcon={openModalIconSelector}
      />
      <ModalReorderLists
        open={isModalOpenReorderLists}
        onClose={handleCloseModalReorderLists}
      />
      <ModalReorderCats
        open={isModalOpenReorderCats}
        onClose={handleCloseModalReorderCats}
      />
      <ModalIconSelector
        open={isModalOpenIconSelector}
        onClose={handleCloseModalIconSelector}
      />
      <ModalItemDetails
        open={isModalOpenItemDetails}
        onClose={handleCloseModalItemDetails}
        currentListItemMenu={currentListItemMenu}
      />
      <ListMenu
        anchorEl={listAnchor}
        open={openListMenu}
        onClose={handleListAnchorClose}
        onAddList={openModalAddList}
        onAddListCat={openModalAddListCat}
        onReorderCats={openModalReorderCats}
        onReorderLists={openModalReorderLists}
      />
      <ListItemMenu
        anchorEl={listItemAnchor}
        open={openListItemMenu}
        onClose={handleListItemAnchorClose}
        onDelete={handleListItemClick}
        onItemDetails={openModalItemDetails}
        listItem={currentListItemMenu}
      />
      <ListNameMenu
        anchorEl={listNameAnchor}
        open={openListNameMenu}
        onClose={handleListNameAnchorClose}
        onEdit={handleEnterListNameEditMode}
        onDelete={openAlertDeleteList}
        listId={currentListNameMenu}
      />
      <AlertDeleteList
        open={isAlertOpenDeleteList}
        onClose={handleCloseAlertDeleteList}
        listId={currentListNameMenu}
      />
      <AlertDeleteListItem
        open={isAlertOpenDeleteListItem}
        onClose={handleCloseAlertDeleteListItem}
        listItem={currentListItemMenu}
      />
    </>
  );
}

export default Lists;
