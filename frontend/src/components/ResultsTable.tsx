import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from 'lucide-react';


interface ResultsTableProps {
  cellType: string | undefined;
  isCancerous: boolean | undefined;
  isVisible: boolean;
}

export interface PredictionResult {
  cellType: string; // Replace with the correct type or import CellClass if it exists
  isCancerous: boolean;
  isVisible: boolean;
}

const ResultsTable: React.FC<PredictionResult> = ({
  cellType,
  isCancerous,
  isVisible
}) => {
  return <Card className="w-full max-w-md mx-auto mt-4 p-4 px-[16px] py-[16px] my-0">
      <h2 className="text-lg font-semibold text-center mb-2">Analysis Results</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Cell Classification</TableHead>
            <TableHead className="w-1/2">Cancer Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{cellType || 'Awaiting analysis'}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {isCancerous !== undefined ? <>
                    {isCancerous ? <>
                        <XCircle className="h-5 w-5 text-medical-danger mr-2" />
                        <span className="font-medium text-medical-danger">Cancerous</span>
                      </> : <>
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium text-green-500">Non-Cancerous</span>
                      </>}
                  </> : 'Awaiting analysis'}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>;
};
export default ResultsTable;