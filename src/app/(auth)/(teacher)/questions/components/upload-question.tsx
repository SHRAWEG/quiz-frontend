// components/csv-upload.tsx
"use client";

import { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useImportQuestions } from '@/hooks/api/useQuestion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/lib/axios';
import { UploadQuestionResDto } from '@/types/question';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function UploadQuestion() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<UploadQuestionResDto>();

  const { mutate: uploadQuestions, isPending } = useImportQuestions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    uploadQuestions({ file },
      {
        onSuccess: (response: ApiResponse<UploadQuestionResDto>) => {
          if (response.success) {
            setFile(null);

            router.push('/questions');

            toast.success('CSV file uploaded successfully!');
          } else {
            setErrors(response.data);
            toast.error('Failed to upload CSV file. Please check the errors.');
          }

        },
        onError: (error) => {
          console.error('Upload failed:', error);
          alert('Failed to upload CSV file. Please try again.');
        }
      }
    );
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Upload Attempts CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border'
              }`}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium">
                  {isDragging ? 'Drop your CSV file here' : 'Drag and drop your CSV file here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Or click to browse files
                </p>
              </div>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('csv-upload')?.click()}
              >
                Select File
              </Button>
            </div>
          </div>

          {file && (
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="submit"
              disabled={!file || isPending}
              className="min-w-32"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload CSV'
              )}
            </Button>
          </div>
        </form>

        {errors && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Errors:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.errors.map((error, index) => (

                    <TableRow key={index}>
                      <TableCell className="px-4 py-2">{error.row}</TableCell>
                      <TableCell className="px-4 py-2">{error.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ul>
          </div>
        )}
      </CardContent>
    </>
  );
}