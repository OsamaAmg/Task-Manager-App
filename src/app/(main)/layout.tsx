"use client";

import Nav from "@/components/Nav";
import { TaskProvider } from "@/context/TasksContexts";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TaskProvider>
      <Nav />
      {children}
    </TaskProvider>
  );
}