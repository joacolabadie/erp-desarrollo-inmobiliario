import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <Button variant="link" size="sm">
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}
