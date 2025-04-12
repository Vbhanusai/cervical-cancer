import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import ResultsTable from '@/components/ResultsTable';
import CellTypesInfo from '@/components/CellTypesInfo';
import { Button } from '@/components/ui/button';
import { Microscope } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { predictCellImage } from '@/services/api';
import { ApiResponse } from '@/types';

const queryClient = new QueryClient();

const App = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ApiResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
    setHasAnalyzed(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image before analysis",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await predictCellImage(selectedImage);
      console.log("API Response:", result); // Log the response for debugging
      if (result.success) {
        setAnalysisResult(result);
        toast({
          title: "Analysis complete",
          description: "Cell image has been successfully analyzed",
          variant: "success", // Added success variant for green toast
        });
      } else {
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: result.error || "An unknown error occurred",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "An unexpected error occurred during analysis",
      });
    } finally {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-4">
            <Header />
            
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-3">
                  <ImageUploader 
                    onImageUpload={handleImageUpload} 
                    isAnalyzing={isAnalyzing}
                  />
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleAnalyze}
                      disabled={!selectedImage || isAnalyzing}
                      className="bg-medical-purple hover:bg-medical-darkPurple transition-colors"
                      size="default"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Microscope className="mr-2 h-4 w-4" />
                          Analyze Image
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <ResultsTable 
                  cellType={analysisResult?.data?.cellClass}
                  isCancerous={analysisResult?.data?.isCancerous}
                  isVisible={hasAnalyzed}
                />
              </div>
              
              <CellTypesInfo isVisible={true} />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;