import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReadingGroup } from '../types';

export function exportToPDF(groups: ReadingGroup[]) {
  if (groups.length === 0) {
    return; // Don't export if there are no readings
  }

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Blood Pressure Log', 14, 20);
  
  // Date range and generation info
  const dates = groups.map(g => g.date);
  const dateRange = dates.length > 1 
    ? `${dates[dates.length - 1]} - ${dates[0]}`
    : dates[0];
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Date Range: ${dateRange}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 14, 33);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Prepare table data
  const tableData: string[][] = [];
  
  groups.forEach(group => {
    // Combine AM and PM readings
    const allReadings = [
      ...group.am.map(r => ({ ...r, period: 'AM' })),
      ...group.pm.map(r => ({ ...r, period: 'PM' }))
    ].sort((a, b) => {
      // Sort by period (AM first) then by time
      if (a.period !== b.period) {
        return a.period === 'AM' ? -1 : 1;
      }
      return a.time.localeCompare(b.time);
    });
    
    if (allReadings.length === 0) {
      // No readings for this date
      tableData.push([
        group.date,
        '-',
        '-',
        '-',
        '-'
      ]);
    } else {
      allReadings.forEach((reading, idx) => {
        const readingStr = `${reading.systolic}/${reading.diastolic}`;
        const heartRateStr = reading.heartRate ? ` HR: ${reading.heartRate}` : '';
        tableData.push([
          idx === 0 ? group.date : '', // Only show date in first row
          reading.period,
          reading.time,
          readingStr + heartRateStr
        ]);
      });
    }
  });
  
  // Create table
  autoTable(doc, {
    head: [['Date', 'Period', 'Time', 'Reading (BP / Heart Rate)']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [89, 52, 141], // Primary color (approximate from oklch)
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [247, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 50 }, // Date
      1: { cellWidth: 30 }, // Period
      2: { cellWidth: 40 }, // Time
      3: { cellWidth: 70, halign: 'center' }, // Reading
    },
    margin: { top: 35 },
  });
  
  // Summary statistics
  const allReadings = groups.flatMap(g => [
    ...g.am,
    ...g.pm
  ]);
  
  if (allReadings.length > 0) {
    const systolicValues = allReadings.map(r => r.systolic);
    const diastolicValues = allReadings.map(r => r.diastolic);
    
    const avgSystolic = Math.round(
      systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length
    );
    const avgDiastolic = Math.round(
      diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length
    );
    const minSystolic = Math.min(...systolicValues);
    const maxSystolic = Math.max(...systolicValues);
    const minDiastolic = Math.min(...diastolicValues);
    const maxDiastolic = Math.max(...diastolicValues);
    
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    let currentY = finalY + 15;
    
    // Add a new page if needed
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Summary Statistics', 14, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Readings: ${allReadings.length}`, 14, currentY);
    currentY += 6;
    doc.text(`Average: ${avgSystolic}/${avgDiastolic} mmHg`, 14, currentY);
    currentY += 6;
    doc.text(`Range: ${minSystolic}/${minDiastolic} - ${maxSystolic}/${maxDiastolic} mmHg`, 14, currentY);
  }
  
  // Save the PDF
  const fileName = `BP_Log_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

