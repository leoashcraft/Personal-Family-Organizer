import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { query } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        try {
          const userData = await query({
            query: "SELECT * FROM contrive.users WHERE username = ?",
            values: [username],
          });

          if (userData.length > 0) {
            let user = userData[0];
            const passwordMatch = await bcrypt.compare(
              password,
              user.password_hash,
            );

            if (passwordMatch) {
              // Create a variable for the user object
              user = {
                user_id: user.user_id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
              };
              return user;
            }
          }
        } catch (error) {
          throw new Error("Login failed");
        }

        return null;
      },
    }),
  ],
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    // brandColor: "", // Hex color code
    // logo: "", // Absolute URL to image
    // buttonText: "" // Hex color code
  },
  session: {
    jwt: true,
  },
  secret: process.env.JWT_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.user_id;
        token.username = user.username;
        token.firstName = user.first_name;
        token.lastName = user.last_name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.userId,
          name: token.firstName + " " + token.lastName,
          firstName: token.firstName,
          lastName: token.lastName,
          username: token.username,
          email: token.email,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
