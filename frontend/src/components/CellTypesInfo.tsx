import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, InfoIcon } from 'lucide-react';
import { CellTypeInfo } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
interface CellTypesInfoProps {
  isVisible: boolean;
}
const CellTypesInfo: React.FC<CellTypesInfoProps> = ({
  isVisible
}) => {
  if (!isVisible) return null;
  const cellTypes: CellTypeInfo[] = [ {
    name: "Koilocytotic Cells",
    description: "Cytoplasmic halo, irregular nucleus, HPV-related changes",
    isCancerous: true
  }, {
    name: "Dyskeratotic Cells",
    description: "Orange cytoplasm, abnormal keratinization, vesicular nuclei",
    isCancerous: true
  }, {
    name: "Metaplastic Cells",
    description: "Parabasal-like cells, uniform size, eccentric nuclei",
    isCancerous: false
  }, {
    name: "Parabasal Cells",
    description: "Small immature cells, large nucleus, cyanophilic cytoplasm",
    isCancerous: false
  }, {
    name: "Superficial-Intermediate Cells",
    description: "Flat cells with small nucleus, eosinophilic cytoplasm",
    isCancerous: false
  }];

  return <Card className="w-full max-w-5xl mx-auto mt-4 mb-5 my-px">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="reference-table" className="border-none">
          <AccordionTrigger className="py-2 px-6">
            <div className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-medical-purple" />
              <h2 className="text-lg font-semibold">Cell Types Reference</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cell Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Cancer Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cellTypes.map(cellType => <TableRow key={cellType.name}>
                    <TableCell className="font-medium py-2">{cellType.name}</TableCell>
                    <TableCell className="py-2">{cellType.description}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center">
                        {cellType.isCancerous ? <>
                            <XCircle className="h-5 w-5 text-medical-danger mr-2" />
                            <span className="font-medium text-medical-danger">Cancerous</span>
                          </> : <>
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <span className="font-medium text-green-500">Non-Cancerous</span>
                          </>}
                      </div>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>;
};
export default CellTypesInfo;