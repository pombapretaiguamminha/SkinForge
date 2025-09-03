import { CheckCircle, Download, Eye, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ConversionResultProps {
  result: any;
  onPreview: () => void;
  onReset: () => void;
}

export default function ConversionResult({ result, onPreview, onReset }: ConversionResultProps) {
  const handleDownload = () => {
    if (result?.data) {
      const blob = new Blob([result.data.content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center">
          <Download className="text-primary mr-2 w-5 h-5" />
          Resultado da Conversão
        </h3>

        {!result ? (
          <div className="text-center py-8" data-testid="default-output-state">
            <Download className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
            <p className="text-muted-foreground">
              Seu arquivo JSON convertido aparecerá aqui
            </p>
          </div>
        ) : result.success ? (
          <div className="fade-in" data-testid="success-output-state">
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircle className="mr-2 w-5 h-5" />
              <span className="font-medium">Conversão concluída com sucesso!</span>
            </div>
            
            <div className="bg-accent rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-accent-foreground" data-testid="text-converted-filename">
                    {result.data.fileName}
                  </p>
                  <p className="text-sm text-muted-foreground">Arquivo JSON do Blockbench</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground" data-testid="text-converted-size">
                    {formatFileSize(result.data.size)}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-conversion-time">
                    {result.conversionTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleDownload}
                className="flex-1"
                data-testid="button-download-json"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar JSON
              </Button>
              <Button 
                variant="outline"
                onClick={onPreview}
                className="flex-1"
                data-testid="button-preview-json"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </div>
        ) : (
          <div className="fade-in" data-testid="error-output-state">
            <div className="flex items-center text-destructive mb-4">
              <AlertTriangle className="mr-2 w-5 h-5" />
              <span className="font-medium">Erro na conversão</span>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-destructive text-sm" data-testid="text-error-message">
                {result.message || "O arquivo .OBJ possui formato inválido ou está corrompido. Verifique se o arquivo é um modelo 3D válido."}
              </p>
            </div>
            <Button 
              variant="secondary"
              onClick={onReset}
              data-testid="button-try-again"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
