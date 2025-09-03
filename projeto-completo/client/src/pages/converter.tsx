import { useState } from "react";
import { Moon, Sun, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import ConversionResult from "@/components/conversion-result";
import PreviewModal from "@/components/preview-modal";

export default function ConverterPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setConversionResult(null);
  };

  const handleConversionComplete = (result: any) => {
    setConversionResult(result);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setConversionResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Box className="text-primary-foreground text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">OBJ to JSON Converter</h1>
                <p className="text-sm text-muted-foreground">Para Blockbench & Minecraft</p>
              </div>
            </div>
            <Button
              onClick={toggleDarkMode}
              variant="secondary"
              size="sm"
              className="p-2 rounded-lg"
              data-testid="button-toggle-dark-mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Converta Arquivos .OBJ para JSON do Blockbench
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforme seus modelos 3D .OBJ em formato JSON compatível com Blockbench para criar skins 5D incríveis para Minecraft PC.
          </p>
        </div>

        {/* Conversion Tool */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-6">
            <FileUpload 
              selectedFile={selectedFile} 
              onFileSelect={handleFileSelect}
              onConversionComplete={handleConversionComplete}
              onReset={handleReset}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <ConversionResult 
              result={conversionResult}
              onPreview={() => setIsModalOpen(true)}
              onReset={handleReset}
            />

            {/* Quick Info Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h4 className="font-semibold text-card-foreground mb-3 flex items-center">
                <Box className="text-primary mr-2 w-4 h-4" />
                Como Usar
              </h4>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  Selecione seu arquivo .OBJ do modelo 3D
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  Clique em "Converter para JSON"
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  Baixe o arquivo JSON convertido
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  Importe no Blockbench para criar skins 5D
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Recursos do Conversor</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Box className="text-primary text-xl" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Compatível Mobile</h4>
              <p className="text-sm text-muted-foreground">Funciona perfeitamente em celulares e tablets</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Box className="text-primary text-xl" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Processamento Local</h4>
              <p className="text-sm text-muted-foreground">Seus arquivos são processados no seu dispositivo</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Box className="text-primary text-xl" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Conversão Rápida</h4>
              <p className="text-sm text-muted-foreground">Processamento otimizado para velocidade</p>
            </div>
          </div>
        </div>

        {/* Example Section */}
        <div className="mt-16 bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center">
            <Box className="text-primary mr-2 w-5 h-5" />
            Exemplo de Saída JSON
          </h3>
          <div className="bg-muted rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-muted-foreground"><code>{`{
    "format_version": "1.10.0",
    "geometry.custom_model": {
        "texturewidth": 64,
        "textureheight": 64,
        "visible_bounds_width": 3,
        "visible_bounds_height": 6,
        "visible_bounds_offset": [0, 3, 0],
        "bones": [
            {
                "name": "root",
                "pivot": [0, 12, 0]
            },
            {
                "name": "head",
                "parent": "root",
                "pivot": [0, 24, 0],
                "cubes": [
                    {
                        "origin": [-4, 24, -2], 
                        "size": [8, 8, 8], 
                        "uv": [0, 0]
                    }
                ]
            }
        ]
    }
}`}</code></pre>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2024 OBJ to JSON Converter. Ferramenta gratuita para criadores Minecraft.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Ajuda
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>

      <PreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jsonContent={conversionResult?.data?.content || ''}
      />
    </div>
  );
}
