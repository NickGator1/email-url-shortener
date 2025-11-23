import { UploadIcon } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
}

const FileUpload = ({ onFileSelect, multiple = false }: FileUploadProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/html': ['.html']
    },
    multiple: multiple
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
            relative flex flex-col items-center justify-center w-full p-12 
            border-2 border-dashed rounded-xl cursor-pointer
            ${isDragActive
            ? 'border-primary bg-primary/5 shadow-lg'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
          }
          `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className={`
              p-4 rounded-full
              ${isDragActive ? 'bg-primary/10' : 'bg-muted'}
            `}>
            <UploadIcon className={`
                w-8 h-8
                ${isDragActive ? 'text-primary' : 'text-muted-foreground'}
              `} />
          </div>
          {isDragActive ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-primary">Drop your HTML file here</p>
              <p className="text-sm text-muted-foreground">Release to upload</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                Drag & drop your HTML file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;