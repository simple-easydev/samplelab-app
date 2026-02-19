"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/use-app-store";

export function StoreDemo() {
  const count = useAppStore((state) => state.count);
  const increment = useAppStore((state) => state.increment);
  const decrement = useAppStore((state) => state.decrement);
  const reset = useAppStore((state) => state.reset);
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-lg font-medium">Zustand store demo</h2>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Counter (from store)</p>
        <p className="text-2xl font-semibold tabular-nums">{count}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={decrement}>
            −
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={increment}>
            +
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Sidebar state</p>
        <p className="font-mono text-sm">
          sidebarOpen: <span className="text-primary">{String(sidebarOpen)}</span>
        </p>
        <Button variant="secondary" size="sm" onClick={toggleSidebar}>
          Toggle sidebar
        </Button>
      </div>
    </div>
  );
}
