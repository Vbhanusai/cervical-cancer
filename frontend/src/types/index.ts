
export interface ApiResponse {
  success: boolean;
  error?: string;
  cellType?: string;
  isCancerous?: boolean;
}

export interface CellTypeInfo {
  name: string;
  description: string;
  isCancerous: boolean;
}

export interface PredictionResult {
  cellClass: string; // Replace with the correct type or import CellClass if it exists
  isCancerous: boolean;
}