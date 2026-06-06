import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera, Loader2, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

interface ImageUploadProps {
  onAnalyze: (base64: string) => void;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onAnalyze, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onAnalyze(base64);
      };
      reader.readAsDataURL(file);
    }
  }, [onAnalyze]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isLoading
  } as any);

  return (
    <div className="w-full" id="image-analyzer">
      <div
        {...getRootProps()}
        className={`relative bento-card border-2 border-dashed p-10 text-center cursor-pointer transition-all bg-white dark:bg-white/[0.02] ${
          isDragActive ? "border-primary bg-primary/5" : "border-stone-200 dark:border-white/10 hover:border-primary/50"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          {preview ? (
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-4 shadow-lg">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                {isLoading && (
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                   </div>
                )}
            </div>
          ) : (
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-10 h-10 text-primary" />
            </div>
          )}
          
          <h3 className="text-xl font-bold mb-2">
            {isDragActive ? "Drop the photo here" : "Upload Ingredient Photo"}
          </h3>
          <p className="text-stone-500 mb-6 max-w-xs mx-auto">
            Drag & drop or click to upload a photo of your fridge or pantry ingredients.
          </p>
          
          {!isLoading && (
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Upload className="w-5 h-5" />
              <span>Choose a file</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
