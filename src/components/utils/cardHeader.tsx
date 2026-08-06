import { CardTitle } from "@/components/ui/card";
import { TITLE } from "@/lib/constants";

export function HeaderTitle() {
  return (
    <CardTitle className="text-2xl font-medium tracking-tight text-center">
      {TITLE}
    </CardTitle>
  );
}
