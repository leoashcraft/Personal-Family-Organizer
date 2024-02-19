import { authOptions } from "@/pages/api/auth/[...nextauth]"; // import your NextAuth configuration
import { getServerSession } from "next-auth/next";
import { query } from "@/lib/db";

export default async function handler(req, res) {
  // Authenticate the user using getServerSession
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Handle GET request
  if (req.method === "GET") {
    try {
      const { listId } = req.query; // Extract the listId from the URL query

      // Perform your database query here
      const items = await query({
        query: "SELECT * FROM contrive.list_items WHERE list_id = ?",
        values: [listId],
      });

      res.status(200).json({ items: items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle any non-GET requests
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
