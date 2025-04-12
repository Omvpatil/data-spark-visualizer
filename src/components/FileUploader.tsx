
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileUp, File, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';

interface FileUploaderProps {
  onDataLoaded: (data: any[]) => void;
}

const FileUploader = ({ onDataLoaded }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processCSVFile = (file: File) => {
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && Array.isArray(results.data)) {
          onDataLoaded(results.data);
          setUploadComplete(true);
          toast({
            title: "Success!",
            description: `Loaded ${results.data.length} rows of data`,
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to parse CSV file",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      setSelectedFile(file);
      processCSVFile(file);
    } else {
      toast({
        title: "Unsupported file",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full p-6">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Data</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Upload a CSV file to start analyzing and visualizing your data
        </p>
        
        <div
          className={`w-full max-w-md border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
          onClick={handleButtonClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv"
            className="hidden"
          />
          
          {!selectedFile && !isLoading && (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drag & Drop or Click to Browse</p>
              <p className="text-sm text-muted-foreground">Supported format: CSV</p>
            </div>
          )}
          
          {isLoading && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-lg font-medium">Processing your file...</p>
            </div>
          )}
          
          {selectedFile && !isLoading && (
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <FileUp className="w-6 h-6 text-primary mr-3" />
                <div className="text-left">
                  <p className="font-medium truncate max-w-[180px]">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadComplete && <Check className="w-5 h-5 text-green-500" />}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex flex-col items-center">
          <Button
            onClick={handleButtonClick}
            className="mb-2"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Select File"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 10MB
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FileUploader;
