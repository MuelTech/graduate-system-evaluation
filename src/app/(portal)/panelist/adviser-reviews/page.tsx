import { redirect } from "next/navigation";

export default function PanelistAdviserReviewsCompatRedirect() {
  redirect("/faculty/advisees?tab=reviews");
}
