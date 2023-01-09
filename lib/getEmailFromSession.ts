import { Session } from "@auth0/nextjs-auth0";

export default function getEmailFromSession(session?:Session | null) {
  return session?.user?.email
}