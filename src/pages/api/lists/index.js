import { authOptions } from "@/pages/api/auth/[...nextauth]"; // import your NextAuth configuration
import { getServerSession } from "next-auth/next";
import { query } from "@/lib/db";

function now() {
  var date = new Date();
  // Convert date to ISO string and remove milliseconds and the 'Z'
  var formattedDate = date.toISOString().replace("T", " ").slice(0, 19);
  return formattedDate;
}

export default async function handler(req, res) {
  
  console.log("API Lists");
  // Authenticate the user using getServerSession
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    console.log("GET");
    try {
      const lists = await query({
        query: `
        SELECT
            lists.user_id AS userId,
            lists.list_id AS listId,
            lists.list_name AS listName,
            lists.list_order AS listOrder,
            lists.category_id AS listCategoryId,
            lists.creation_date AS listCreationDate,
            lists.last_modified AS listLastModified,
            list_items.item_id AS itemId,
            list_items.item_name AS itemName,
            list_items.item_order AS itemOrder,
            list_items.status AS itemStatus,
            list_items.priority AS itemPriority,
            list_items.notes AS itemNotes,
            list_items.due_date AS itemDueDate,
            list_items.creation_date AS itemCreationDate,
            list_items.last_modified AS itemLastModified
        FROM
            contrive.lists
        LEFT JOIN
            contrive.list_items ON lists.list_id = list_items.list_id
        JOIN
            contrive.users ON lists.user_id = users.user_id
        WHERE
            lists.user_id = ?
        ORDER BY lists.list_order, list_items.item_order`,
        values: [session.user.id],
      });
      const listsMap = new Map();
      // Group the data by listId
      const groupedData = lists.reduce((acc, item) => {
        if (!listsMap.has(item.listId)) {
          listsMap.set(item.listId, {
            userId: item.userId,
            listId: item.listId,
            listName: item.listName,
            listOrder: item.listOrder,
            listCategoryId: item.listCategoryId,
            listCreationDate: item.listCreationDate,
            listLastModified: item.listLastModified,
            items: []
          });
        }
        if (item.itemId) {
          listsMap.get(item.listId).items.push({
            itemId: item.itemId,
            itemName: item.itemName,
            itemOrder: item.itemOrder,
            itemStatus: item.itemStatus,
            itemPriority: item.itemPriority,
            itemNotes: item.itemNotes,
            itemDueDate: item.itemDueDate,
            itemCreationDate: item.itemCreationDate,
            itemLastModified: item.itemLastModified,
          });
        }
        return acc;
      }, {});

      const groupedLists = Array.from(listsMap.values());

      res.status(200).json({ lists: groupedLists });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  if (req.method === "POST") {
    console.log("POST");
    console.log(req.body);
    const { categoryId, listName } = req.body;
    try {
      const addList = await query({
        query: "INSERT INTO contrive.lists (category_id, list_name, user_id) VALUES (?, ?, ?)",
        values: [categoryId, listName, session.user.id],
      });
      if (addList.insertId) {
        const newList = {
          listId: addList.insertId,
          listName: addList.listName,
        };
        res.status(200).json({ message: "success", list: newList });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }

  if (req.method === "PUT") {
    console.log("PUT");
    const { listName, listOrder, listId } = req.body;

    try {
      const updateList = await query({
        query:
          "UPDATE contrive.lists SET list_name = ?, list_order = ?, last_modified = ? WHERE list_id = ?",
        values: [listName, listOrder, now(), listId],
      });
      if (updateList.affectedRows) {
        res.status(200).json({
          response: { message: "success", listId, listName },
        });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }

  if (req.method === "DELETE") {
    console.log("DELETE");
    const { listId } = req.body;
    try {
      const deleteList = await query({
        query: "DELETE FROM contrive.lists WHERE list_id = ?",
        values: [listId],
      });
      if (deleteList.affectedRows) {
        res.status(200).json({ message: "success", listId });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }
}
