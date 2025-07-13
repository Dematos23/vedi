
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportPdfButtonProps {
  patientName: string;
}

export function ExportPdfButton({ patientName }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    const patientDetails = document.getElementById('patient-details');
    const therapistNotes = document.getElementById('therapist-notes');
    const appointmentHistory = document.getElementById('appointment-history');
    const patientHeader = document.getElementById('patient-header');

    if (!patientDetails || !therapistNotes || !appointmentHistory || !patientHeader) {
      console.error('One or more elements to export were not found.');
      setIsExporting(false);
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let yPos = 15;

    const addCanvasToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (yPos + imgHeight > pdfHeight - 15) {
            pdf.addPage();
            yPos = 15;
        }

        pdf.addImage(imgData, 'PNG', 10, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
    };
    
    try {
        await addCanvasToPdf(patientHeader);
        await addCanvasToPdf(patientDetails);
        await addCanvasToPdf(therapistNotes);
        await addCanvasToPdf(appointmentHistory);

        pdf.save(`${patientName.replace(/\s+/g, '_')}_details.pdf`);
    } catch (error) {
        console.error("Error exporting to PDF:", error);
    } finally {
        setIsExporting(false);
    }

  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export PDF'}
    </Button>
  );
}
