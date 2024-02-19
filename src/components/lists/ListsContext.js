import React, { createContext, useState, useEffect, useContext } from "react";

export const ListsContext = createContext();

export const useLists = () => useContext(ListsContext);

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isItemLoading, setIsItemLoading] = useState(false);

  function now() {
    var date = new Date();
    // Convert date to ISO string and remove milliseconds and the 'Z'
    var formattedDate = date.toISOString().replace("T", " ").slice(0, 19);
    return formattedDate;
  }

  const addCategory = async (categoryName, categoryIcon) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          categoryName: categoryName,
          categoryIcon: categoryIcon,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchCategoriesUpdate();

    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsItemLoading(false);
    }
  };
  const addList = async (categoryId, listName) => {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        body: JSON.stringify({
          categoryId: categoryId,
          listName: listName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchListsUpdate();

    } catch (error) {
      console.error("Error adding list:", error);
    } finally {
      setIsItemLoading(false);
    }
  };

  const addListItem = async (listId, listItemName) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        body: JSON.stringify({
          listId: listId,
          listItemName: listItemName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchListsUpdate();

    } catch (error) {
      console.error("Error adding list:", error);
    } finally {
      setIsItemLoading(false);
    }
  };

  const updateCategoryOrder = async (updatedCategories) => {
    setCategories(updatedCategories);
    const updatePromises = updatedCategories.map((cat, index) => {
      return fetch('/api/categories', {
        method: 'PUT',
        body: JSON.stringify({
          categoryName: cat.categoryName,
          categoryOrder: index,
          categoryIcon: cat.categoryIcon,
          categoryId: cat.categoryId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    try {
      await Promise.all(updatePromises);
      setIsItemLoading(false)
    } catch (error) {
      console.error("Error updating category order:", error);
      setIsItemLoading(false)
    }
  };
  const updateListOrder = async (updatedLists) => {

    const reorderedLists = updatedLists.map((list, index) => ({
      ...list,
      listOrder: index
    }));

        setLists(prevLists => {
          const updatedListIds = reorderedLists.map(list => list.listId);
          const otherLists = prevLists.filter(list => !updatedListIds.includes(list.listId));
          const newLists = [...reorderedLists, ...otherLists].sort((a, b) => a.listOrder - b.listOrder);
          return newLists;
       });

    const updatePromises = reorderedLists.map(list => {
      return fetch('/api/lists', {
        method: 'PUT',
        body: JSON.stringify({
          listName: list.listName,
          listOrder: list.listOrder,
          listId: list.listId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  
    try {
      await Promise.all(updatePromises);
      setIsItemLoading(false);
    } catch (error) {
      console.error("Error updating list order:", error);
      setIsItemLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!selectedCategory) setSelectedCategory(data.categories[0].categoryId);

      return data.categories;

    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };
  const fetchLists = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.lists;
    } catch (error) {
      console.error("Failed to fetch lists:", error);
      return [];
    }
  };
  const fetchCategoriesUpdate = async () => {
    const fetchedCategories = await fetchCategories();
    setCategories(fetchedCategories || []);
  };
  const fetchListsUpdate = async () => {
    const fetchedLists = await fetchLists();
    setLists(fetchedLists || []);
  };
  const fetchListsAndCategoriesUpdate = async () => {
    const fetchedLists = await fetchLists();
    const fetchedCategories = await fetchCategories();
    setLists(fetchedLists || []);
    setCategories(fetchedCategories || []);
  };

  useEffect(() => {
    fetchListsAndCategoriesUpdate();
  }, []);

  return (
    <ListsContext.Provider
      value={{
        lists,
        setLists,
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        selectedList,
        setSelectedList,
        isLoading,
        setIsLoading,
        isItemLoading,
        setIsItemLoading,
        updateListOrder,
        updateCategoryOrder,
        fetchListsUpdate,
        fetchCategoriesUpdate,
        fetchListsAndCategoriesUpdate,
        addCategory,
        addList,
        addListItem
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};
