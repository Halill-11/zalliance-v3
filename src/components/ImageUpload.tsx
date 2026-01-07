import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}
export function ImageUpload({ value = [], onChange, disabled, maxFiles = 5 }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;
    // Calculate how many more files we can add
    const remainingSlots = maxFiles - value.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }
    const filesToProcess = acceptedFiles.slice(0, remainingSlots);
    if (filesToProcess.length < acceptedFiles.length) {
      toast.info(`Only adding ${filesToProcess.length} images to stay within limit of ${maxFiles}`);
    }
    const newImages: string[] = [];
    let processedCount = 0;
    filesToProcess.forEach((file) => {
      // Limit file size to 300KB
      if (file.size > 300 * 1024) {
        toast.error(`Image ${file.name} is too large. Max 300KB.`);
        processedCount++;
        if (processedCount === filesToProcess.length && newImages.length > 0) {
             onChange([...value, ...newImages]);
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          newImages.push(result);
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          onChange([...value, ...newImages]);
        }
      };
      reader.onerror = () => {
        toast.error(`Error reading file ${file.name}`);
        processedCount++;
        if (processedCount === filesToProcess.length && newImages.length > 0) {
             onChange([...value, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [onChange, disabled, maxFiles, value]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    disabled: disabled || value.length >= maxFiles
  });
  const handleRemove = (index: number) => {
    if (disabled) return;
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-slate-200 bg-slate-100 group">
            <div className="absolute top-1 right-1 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-6 w-6 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <img
              src={url}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {value.length < maxFiles && (
           <div
            {...getRootProps()}
            className={cn(
              "relative aspect-square border-2 border-dashed rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/50",
              isDragActive ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20" : "border-slate-200 hover:border-amber-600 dark:border-slate-800",
              disabled && "opacity-50 cursor-not-allowed hover:border-slate-200"
            )}
          >
            <input {...getInputProps()} />
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Plus className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-center px-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Ajouter
              </p>
            </div>
          </div>
        )}
      </div>
      {value.length === 0 && (
         <div
         {...getRootProps()}
         className={cn(
           "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[150px]",
           isDragActive ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20" : "border-slate-200 hover:border-amber-600 dark:border-slate-800",
           disabled && "opacity-50 cursor-not-allowed hover:border-slate-200"
         )}
       >
         <input {...getInputProps()} />
         <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
           <Upload className="h-6 w-6 text-slate-500" />
         </div>
         <div className="text-center space-y-1">
           <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
             Cliquez ou glissez des images ici
           </p>
           <p className="text-xs text-slate-500 dark:text-slate-400">
             JPG, PNG, WEBP (Max 300KB)
           </p>
         </div>
       </div>
      )}
      <p className="text-xs text-muted-foreground">
        {value.length} / {maxFiles} images
      </p>
    </div>
  );
}