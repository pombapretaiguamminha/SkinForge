import { X, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonContent: string;
}

export default function PreviewModal({ isOpen, onClose, jsonContent }: PreviewModalProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonContent);
      toast({
        title: "JSON copiado!",
        description: "O conteúdo foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (jsonContent) {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_model.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden" data-testid="modal-json-preview">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Visualizar JSON Convertido</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] p-4 border rounded-lg bg-muted">
          <pre className="text-sm text-muted-foreground overflow-x-auto" data-testid="text-json-content">
            <code>{jsonContent || '// JSON convertido aparecerá aqui'}</code>
          </pre>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="secondary"
            onClick={handleCopy}
            data-testid="button-copy-json"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar
          </Button>
          <Button 
            onClick={handleDownload}
            data-testid="button-download-from-modal"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
