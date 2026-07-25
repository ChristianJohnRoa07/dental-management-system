import { redirect } from "next/navigation";
import { UI_ROUTES } from "@/lib/routes";

export default function RootPage() {
  redirect(UI_ROUTES.AUTH.LOGIN);
}