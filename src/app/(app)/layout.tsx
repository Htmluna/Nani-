import Nav from "@/components/Nav";
import { requireProfile } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Nav username={profile.username} points={profile.points} />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
