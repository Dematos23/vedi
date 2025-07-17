
"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '@/contexts/language-context';

interface ExportAppointmentPdfButtonProps {
  appointmentId: string;
  serviceName: string;
}

export function ExportAppointmentPdfButton({ appointmentId, serviceName }: ExportAppointmentPdfButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const { dictionary } = useLanguage();
  const d = dictionary.appointments;

  const handleExport = async () => {
    setIsExporting(true);

    const appointmentView = document.getElementById('appointment-view');

    if (!appointmentView) {
      console.error('Element to export was not found.');
      setIsExporting(false);
      return;
    }

    try {
        const canvas = await html2canvas(appointmentView, { 
            scale: 2,
            useCORS: true, 
            logging: false 
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pdfWidth; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`Appointment_${serviceName.replace(/\s+/g, '_')}_${appointmentId}.pdf`);

    } catch (error) {
        console.error("Error exporting to PDF:", error);
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? d.exporting : d.exportPdf}
    </Button>
  );
}
