import { authOptions } from "@/pages/api/auth/[...nextauth]"; // import your NextAuth configuration
import { getServerSession } from "next-auth/next";
import { query } from "@/lib/db";

export default async function handler(req, res) {
  // Authenticate the user using getServerSession
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    console.log("POST");
    const { listId, listItemName } = req.body;
    try {
      const addItem = await query({
        query:
          "INSERT INTO contrive.list_items (list_id, item_name) VALUES (?, ?)",
        values: [listId, listItemName],
      });
      if (addItem.insertId) {
        const newListItem = {
          listItemId: addItem.insertId,
        };
        res.status(200).json({ message: "success", item: listItemName });
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
    const { listItemName, listItemOrder, lastModified, listId, listItemId } =
      req.body;

    try {
      const updateList = await query({
        query:
          "UPDATE contrive.list_items SET item_name = ?, item_order = ?, last_modified = ?, list_id = ? WHERE item_id = ?",
        values: [listItemName, listItemOrder, lastModified, listId, listItemId],
      });
      console.log(updateList);
      if (updateList.affectedRows) {
        res.status(200).json({
          message: "success",
          item: updateList.affectedRows,
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
    const { listItemId } = req.body;
    try {
      const deleteItem = await query({
        query: "DELETE FROM contrive.list_items WHERE item_id = ?",
        values: [listItemId],
      });
      if (deleteItem.affectedRows) {
        res.status(200).json({ message: "success", listItemId });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }
}
