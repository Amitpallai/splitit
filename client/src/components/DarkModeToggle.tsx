'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider'; // <- your custom hook
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="dark-mode" checked={isDark} onCheckedChange={handleToggle} />
      <Label htmlFor="dark-mode">
        {isDark ? (
          <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        ) : (
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        )}
      </Label>
    </div>
  );
}
