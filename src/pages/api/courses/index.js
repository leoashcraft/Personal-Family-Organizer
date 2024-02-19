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
    console.log("GET COURSES");
    try {
      const courses = await query({
        query: `
        SELECT
            course_id AS courseId,
            course_order AS courseOrder,
            course_name AS courseName,
            course_icon AS courseIcon
        FROM
            contrive.recipe_courses
        WHERE
            recipe_courses.user_id = ?
        ORDER BY course_order;`,
        values: [session.user.id],
      });

      res.status(200).json({ courses: courses });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }

  if (req.method === "POST") {
    console.log("POST COURSE");
    const { courseName, courseIcon } = req.body;
    try {
      console.log(req.body);
      const addCourse = await query({
        query:
          "INSERT INTO contrive.recipe_courses (course_name, course_icon, user_id) VALUES (?, ?, ?)",
        values: [courseName, courseIcon, session.user.id],
      });
      if (addCourse.insertId) {
        const newCourse = {
          CourseId: addCourse.insertId,
          courseName: courseName,
          courseIcon: courseIcon,
        };
        res.status(200).json({ message: "success", courses: newCourse });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }

  if (req.method === "PUT") {
    console.log("PUT COURSE");
    const { courseName, courseOrder, courseIcon, courseId } = req.body;

    try {
      const updateCourse = await query({
        query:
          "UPDATE contrive.recipe_courses SET course_name = ?, course_order = ?, course_icon = ?, last_modified = ? WHERE course_id = ?",
        values: [courseName, courseOrder, courseIcon, now(), courseId],
      });
      if (updateCourse.affectedRows) {
        res.status(200).json({
          response: {
            message: "success",
            courseName,
            courseOrder,
            courseIcon,
            courseId,
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
    console.log("DELETE COURSE");
    const { courseId } = req.body;
    try {
      const deleteCourse = await query({
        query: "DELETE FROM contrive.recipe_courses WHERE course_id = ?",
        values: [courseId],
      });
      if (deleteCourse.affectedRows) {
        res.status(200).json({ message: "success", courseId });
      } else {
        res.status(400).json({ message: "error" });
      }
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
      console.log(error);
    }
  }
}
