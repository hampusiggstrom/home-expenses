import { useState, useCallback, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { parseCsv } from '../../lib/csv-parser';
import type { Expense } from '../../types/expense';

interface CsvUploaderProps {
  onFilesParsed: (expenses: Expense[]) => void;
}

export function CsvUploader({ onFilesParsed }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const allExpenses: Expense[] = [];

      for (const file of Array.from(files)) {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
          throw new Error(`${file.name} is not a CSV file`);
        }
        const expenses = await parseCsv(file);
        allExpenses.push(...expenses);
      }

      if (allExpenses.length === 0) {
        throw new Error('No valid expenses found in the CSV file(s)');
      }

      onFilesParsed(allExpenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  }, [onFilesParsed]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div
          className={`
            flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            ${isLoading ? 'opacity-50 cursor-wait' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isLoading}
          />

          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p className="text-sm text-muted-foreground">Läser CSV-filer...</p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                {isDragging ? (
                  <FileText className="h-8 w-8 text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-primary" />
                )}
              </div>
              <p className="text-lg font-medium text-foreground mb-1">
                {isDragging ? 'Släpp dina filer här' : 'Ladda upp Splitwise CSV'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Dra och släpp eller klicka för att bläddra
              </p>
              <p className="text-xs text-muted-foreground">
                Exportera från Splitwise: Inställningar → Exportera som kalkylblad
              </p>
            </>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
