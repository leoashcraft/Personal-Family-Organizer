async function fetchAPI(url, method, body) {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

function now() {
  var date = new Date();
  // Convert date to ISO string and remove milliseconds and the 'Z'
  var formattedDate = date.toISOString().replace("T", " ").slice(0, 19);
  return formattedDate;
}

async function getLists() {
  try {
    console.log("Fetching lists...");
    const response = await fetchAPI(
      `${process.env.NEXT_PUBLIC_URL}/api/lists`,
      "GET",
    );
    console.log("Lists fetched:", response.lists);
    return response.lists;
  } catch (error) {
    console.error("Failed to fetch lists:", error);
    throw error;
  }
}

async function addList(listName) {
  if (listName.length < 3) return;
  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/lists`,
    "POST",
    {
      userId: 1,
      listName: listName,
      listOrder: 0,
    },
  );
  if (response.message !== "success") return;
  setLists([...lists, response.list]);
  setActionStatus({ ...actionStatus, created: true });
  getLists();
  fetchListsAndUpdateLinks();
}

async function updateList(listIdToUpdate, listOrderToUpdate = 0) {
  if (!listIdToUpdate.length) return;

  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/lists`,
    "PUT",
    {
      listId: listIdToUpdate,
      listOrder: listOrderToUpdate,
      lastModified: now(),
    },
  );

  if (response && response.message === "success") {
    const updatedLists = lists.filter((list) => list.listId !== listId);
    setLists(updatedLists);
    setActionStatus({ ...actionStatus, updated: true });
    getLists();
    fetchListsAndUpdateLinks();
  } else {
    setActionStatus({ ...actionStatus, error: true });
  }
}

async function deleteList(listId) {
  if (!listId) return;

  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/lists`,
    "DELETE",
    { listId },
  );

  if (response && response.message === "success") {
    const updatedLists = lists.filter((list) => list.listId !== listId);
    setLists(updatedLists);
    setActionStatus({ ...actionStatus, deleted: true });
    getLists();
    fetchListsAndUpdateLinks();
  } else {
    setActionStatus({ ...actionStatus, error: true });
  }
}

async function getItems() {
  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/items`,
    "GET",
  );
  if (response && response.items) {
    setItems(response.items);
  } else {
    /* */
  }
}

async function addItem(listId, newListItemName) {
  if (!listId || newListItemName.length < 3) return;

  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/items`,
    "POST",
    {
      listId: listId,
      listItemName: newListItemName,
    },
  );
  if (response && response.message === "success") {
    const updatedLists = lists.filter((list) => list.listId !== listId);
    setLists(updatedLists);
    setActionStatus({ ...actionStatus, created: true });
    getLists();
    fetchListsAndUpdateLinks();
  } else {
    setActionStatus({ ...actionStatus, error: true });
  }
  toggleAddItemInput(listId);
}

async function updateItem(listItemName, listItemOrder = 0, listId, listItemId) {
  if (
    typeof listItemName !== "string" ||
    listItemName.length < 3 ||
    !listItemId ||
    !listId
  ) {
    console.error("Invalid input for updateItem:", {
      listItemName,
      listItemOrder,
      listId,
      listItemId,
    });
    return;
  }
  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/items`,
    "PUT",
    {
      listItemName: listItemName,
      listItemOrder: listItemOrder,
      lastModified: now(),
      listId: listId,
      listItemId: listItemId,
    },
  );
}

async function moveItem(oldListId, oldListItemId, newListId, newListItemName) {
  deleteItem(oldListId, oldListItemId);
  addItem(newListId, newListItemName);
}

async function deleteItem(listId, listItemId) {
  if (!listItemId) return;

  const response = await fetchAPI(
    `${process.env.NEXT_PUBLIC_URL}/api/items`,
    "DELETE",
    {
      listItemId: listItemId,
    },
  );

  if (response && response.message === "success") {
    const updatedLists = lists.filter((list) => list.listId !== listId);
    setLists(updatedLists);
    setActionStatus({ ...actionStatus, deleted: true });
    getLists();
    fetchListsAndUpdateLinks();
  } else {
    setActionStatus({ ...actionStatus, error: true });
  }
}

async function getCategories() {
  try {
    console.log("Fetching categories...");
    const response = await fetchAPI(
      `${process.env.NEXT_PUBLIC_URL}/api/categories`,
      "GET",
    );
    console.log("Categories fetched:", response.categories);
    return response.categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

async function getCategoriesAndLists() {
  const categories = await getCategories();
  const lists = await getLists();
  return { categories, lists };
}

export {
  fetchAPI,
  getLists,
  addList,
  updateList,
  deleteList,
  getItems,
  addItem,
  updateItem,
  moveItem,
  deleteItem,
  getCategories,
  getCategoriesAndLists,
};
