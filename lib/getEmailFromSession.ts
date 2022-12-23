import { Session } from "next-auth";

export default function getEmailFromSession(session:Session | null) {
  return session?.user?.email
}