import { redirect } from "next/navigation";

export default function PanelistAdviserRequestsCompatRedirect() {
  redirect("/faculty/advisees?tab=requests");
}
