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
  
  console.log("API Recipes");
  // Authenticate the user using getServerSession
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    console.log("GET");
    try {
      const recipes = await query({
        query: `
        SELECT
            recipes.user_id AS userId,
            recipes.recipe_id AS recipeId,
            recipes.recipe_name AS recipeName,
            recipes.recipe_order AS recipeOrder,
            recipes.course_id AS recipeCourseId,
            recipes.creation_date AS recipeCreationDate,
            recipes.last_modified AS recipeLastModified,
            recipe_ingredients.ingredient_id AS ingredientId,
            recipe_ingredients.ingredient_name AS ingredientName,
            recipe_ingredients.ingredient_order AS ingredientOrder,
            recipe_ingredients.creation_date AS ingredientCreationDate,
            recipe_ingredients.last_modified AS ingredientLastModified
        FROM
            contrive.recipes
        LEFT JOIN
            contrive.recipe_ingredients ON recipes.recipe_id = recipe_ingredients.recipe_id
        JOIN
            contrive.users ON recipes.user_id = users.user_id
        WHERE
        recipes.user_id = ?
        ORDER BY recipes.recipe_order, recipe_ingredients.ingredient_order`,
        values: [session.user.id],
      });
      const recipesMap = new Map();
      // Group the data by recipeId
      const groupedData = recipes.reduce((acc, item) => {
        if (!recipesMap.has(item.recipeId)) {
            recipesMap.set(item.recipeId, {
            userId: item.userId,
            recipeId: item.recipeId,
            recipeName: item.recipeName,
            recipeOrder: item.recipeOrder,
            recipeCourseId: item.recipeCourseId,
            recipeCreationDate: item.recipeCreationDate,
            recipeLastModified: item.recipeLastModified,
            ingredients: []
          });
        }
        if (item.ingredientId) {
          recipesMap.get(item.recipeId).ingredients.push({
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            ingredientOrder: item.ingredientOrder,
            ingredientCreationDate: item.ingredientCreationDate,
            ingredientLastModified: item.ingredientLastModified,
          });
        }
        return acc;
      }, {});

      const groupedRecipes = Array.from(recipesMap.values());

      res.status(200).json({ recipes: groupedRecipes });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  if (req.method === "POST") {
    console.log("POST");
    console.log(req.body);
    const { courseId, recipeName } = req.body;
    try {
      const addRecipe = await query({
        query: "INSERT INTO contrive.recipes (course_id, recipe_name, user_id) VALUES (?, ?, ?)",
        values: [categoryId, recipeName, session.user.id],
      });
      if (addRecipe.insertId) {
        const newRecipe = {
        recipeId: addRecipe.insertId,
        recipeName: addRecipe.recipeName,
        };
        res.status(200).json({ message: "success", recipe: newRecipe });
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
    const { recipeName, recipeOrder, recipeId } = req.body;

    try {
      const updateRecipe = await query({
        query:
          "UPDATE contrive.recipes SET recipe_name = ?, recipe_order = ?, last_modified = ? WHERE recipe_id = ?",
        values: [recipeName, recipeOrder, now(), recipeId],
      });
      if (updateRecipe.affectedRows) {
        res.status(200).json({
          response: { message: "success", recipeId, recipeName },
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
    const { recipeId } = req.body;
    try {
      const deleteRecipe = await query({
        query: "DELETE FROM contrive.recipes WHERE recipe_id = ?",
        values: [recipeId],
      });
      if (deleteRecipe.affectedRows) {
        res.status(200).json({ message: "success", recipeId });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }
}
