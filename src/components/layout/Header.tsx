import { Home, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
  onClearData?: () => void;
  hasData: boolean;
}

export function Header({ onClearData, hasData }: HeaderProps) {
  const handleClear = () => {
    if (window.confirm('Är du säker på att du vill rensa all utgiftsdata? Detta kan inte ångras.')) {
      onClearData?.();
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Hemutgifter</h1>
          </div>
          {hasData && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Rensa data
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
