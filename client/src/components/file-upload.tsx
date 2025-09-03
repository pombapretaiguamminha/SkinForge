import { useState, useRef } from "react";
import { Upload, X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onConversionComplete: (result: any) => void;
  onReset: () => void;
}

export default function FileUpload({ selectedFile, onFileSelect, onConversionComplete, onReset }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('objFile', file);

      const response = await apiRequest('POST', '/api/convert', formData);
      return await response.json();
    },
    onSuccess: (data) => {
      setProgress(100);
      setTimeout(() => {
        onConversionComplete(data);
        setProgress(0);
        toast({
          title: "Conversão concluída!",
          description: "Seu arquivo foi convertido com sucesso.",
        });
      }, 500);
    },
    onError: (error) => {
      setProgress(0);
      toast({
        title: "Erro na conversão",
        description: error instanceof Error ? error.message : "Falha na conversão do arquivo",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.obj')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos .obj",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive",
      });
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleConvert = () => {
    if (selectedFile) {
      setProgress(0);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      
      convertMutation.mutate(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center">
            <Upload className="text-primary mr-2 w-5 h-5" />
            Selecionar Arquivo .OBJ
          </h3>
          
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-accent' 
                  : 'border-border hover:bg-accent/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-file-upload"
            >
              <Upload className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
              <p className="text-lg font-medium text-foreground mb-2">
                Clique para selecionar ou arraste o arquivo aqui
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Suporta arquivos .obj até 10MB
              </p>
              <Button variant="default" data-testid="button-choose-file">
                Escolher Arquivo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".obj"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                data-testid="input-file-select"
              />
            </div>
          ) : (
            <div className="bg-accent rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="text-primary mr-2 w-4 h-4" />
                  <div>
                    <p className="font-medium text-accent-foreground" data-testid="text-selected-filename">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="text-file-size">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  data-testid="button-remove-file"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Button
            onClick={handleConvert}
            disabled={!selectedFile || convertMutation.isPending}
            className="w-full"
            data-testid="button-convert"
          >
            {convertMutation.isPending ? (
              <>
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                Convertendo...
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4 mr-2" />
                Converter para JSON
              </>
            )}
          </Button>
          
          {convertMutation.isPending && progress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Processando arquivo...</span>
                <span data-testid="text-conversion-progress">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" data-testid="progress-conversion" />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
