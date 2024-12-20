import { UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  );
}
