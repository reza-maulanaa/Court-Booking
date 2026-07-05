import Link from "next/link";
import { Goal } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export async function Navbar() {
  const session = await getSession();
  const user = session
    ? await db.query.users.findFirst({
        columns: { name: true },
        where: eq(users.id, session.sub),
      })
    : null;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-primary md:text-2xl"
        >
          <Goal className="size-7" aria-hidden />
          Booking Futsal
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {session ? (
            <>
              {session.role === "admin" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/bookings">Booking Saya</Link>
              </Button>
              <span className="hidden max-w-32 truncate text-sm text-muted-foreground sm:inline">
                {user?.name}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
