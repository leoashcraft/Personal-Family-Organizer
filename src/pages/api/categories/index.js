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
  // Authenticate the user using getServerSession
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    console.log("GET CATEGORIES");
    try {
      const categories = await query({
        query: `
        SELECT
            category_id AS categoryId,
            category_order AS categoryOrder,
            category_name AS categoryName,
            category_icon AS categoryIcon
        FROM
            contrive.list_categories
        WHERE
            list_categories.user_id = ?
        ORDER BY category_order;`,
        values: [session.user.id],
      });

      res.status(200).json({ categories: categories });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  if (req.method === "POST") {
    console.log("POST CATEGORY");
    const { categoryName, categoryIcon } = req.body;
    try {
      console.log(req.body);
      const addCategory = await query({
        query:
          "INSERT INTO contrive.list_categories (category_name, category_icon, user_id) VALUES (?, ?, ?)",
        values: [categoryName, categoryIcon, session.user.id],
      });
      if (addCategory.insertId) {
        const newCategory = {
          CategoryId: addCategory.insertId,
          categoryName: categoryName,
          categoryIcon: categoryIcon,
        };
        res.status(200).json({ message: "success", categories: newCategory });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }

  if (req.method === "PUT") {
    console.log("PUT CATEGORY");
    const { categoryName, categoryOrder, categoryIcon, categoryId } = req.body;

    try {
      const updateCategory = await query({
        query:
          "UPDATE contrive.list_categories SET category_name = ?, category_order = ?, category_icon = ?, last_modified = ? WHERE category_id = ?",
        values: [categoryName, categoryOrder, categoryIcon, now(), categoryId],
      });
      if (updateCategory.affectedRows) {
        res.status(200).json({
          response: {
            message: "success",
            categoryName,
            categoryOrder,
            categoryIcon,
            categoryId,
          },
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
    console.log("DELETE CATEGORY");
    const { categoryId } = req.body;
    try {
      const deleteCategory = await query({
        query: "DELETE FROM contrive.list_categories WHERE category_id = ?",
        values: [categoryId],
      });
      if (deleteCategory.affectedRows) {
        res.status(200).json({ message: "success", categoryId });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }
}
