"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ExportButtonProps {
  userId: string;
  periodeId: string;
}

export function ExportButton({ userId, periodeId }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExport = async () => {
    if (!userId || !periodeId) return;
    
    setLoading(true);
    try {
      // Trigger download
      const url = `/api/export-proker?userId=${userId}&periodeId=${periodeId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'Laporan_Proker.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      
    } catch (error) {
      console.error('Export error:', error);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={loading || !periodeId}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mengekspor...
        </span>
      ) : (
        'Export ke Excel'
      )}
    </Button>
  );
}