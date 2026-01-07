import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    // Limit file size to 300KB to prevent Durable Object storage issues
    // Base64 encoding increases size by ~33%, so 300KB -> ~400KB string
    if (file.size > 300 * 1024) {
      toast.error("L'image est trop volumineuse. Max 300KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
    };
    reader.readAsDataURL(file);
  }, [onChange]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1,
    disabled
  });
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };
  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[200px]",
          isDragActive ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20" : "border-slate-200 hover:border-amber-600 dark:border-slate-800",
          disabled && "opacity-50 cursor-not-allowed hover:border-slate-200"
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={value} 
              alt="Preview" 
              className="max-h-[180px] object-contain rounded-md" 
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Cliquez ou glissez une image ici
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG, WEBP (Max 300KB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}