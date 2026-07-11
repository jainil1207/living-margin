import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Redirect to the dashboard by default when visiting /admin
  redirect("/admin/dashboard");
}
