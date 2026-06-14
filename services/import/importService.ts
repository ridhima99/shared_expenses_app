import { prisma } from '@/lib/prisma/client';
import { getSession } from '@/lib/auth/session';
import * as Papa from 'papaparse';
import { Decimal } from '@prisma/client/runtime/library';
import { balanceService } from '@/services/balance/balanceService';

export class ImportService {
  async importCSV(groupId: string, csvContent: string) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });
    
    const rows = parsed.data as any[];
    
    const importJob = await prisma.importJob.create({
      data: {
        groupId,
        fileName: 'uploaded.csv',
        totalRows: rows.length,
        processedRows: 0,
        status: 'PENDING',
      },
    });
    
    const anomalyReports: any[] = [];
    const validRows: any[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const importRow = await prisma.importRow.create({
        data: {
          importJobId: importJob.id,
          rowIndex: i,
          rawData: row,
          status: 'PENDING',
        },
      });
      
      const anomalies = await this.detectAnomalies(row, groupId, i);
      
      if (anomalies.length > 0) {
        for (const anomaly of anomalies) {
          anomalyReports.push({
            importRowId: importRow.id,
            type: anomaly.type,
            message: anomaly.message,
            severity: anomaly.severity,
            oldValue: anomaly.oldValue,
            newValue: anomaly.newValue,
          });
        }
        importRow.status = 'HAS_ANOMALIES';
      } else {
        validRows.push({ importRowId: importRow.id, data: row });
        importRow.status = 'VALID';
      }
      
      await prisma.importRow.update({
        where: { id: importRow.id },
        data: { status: importRow.status },
      });
    }
    
    if (anomalyReports.length > 0) {
      await prisma.anomalyReport.createMany({
        data: anomalyReports,
      });
    }
    
    await prisma.importJob.update({
      where: { id: importJob.id },
      data: {
        processedRows: rows.length,
        status: anomalyReports.length > 0 ? 'HAS_ANOMALIES' : 'READY',
      },
    });
    
    return {
      importJobId: importJob.id,
      totalRows: rows.length,
      validRows: validRows.length,
      anomalies: anomalyReports.length,
    };
  }
  
  async detectAnomalies(row: any, groupId: string, rowIndex: number) {
    const anomalies: any[] = [];
    
    if (!row.amount || row.amount === '') {
      anomalies.push({
        type: 'MISSING_AMOUNT',
        message: 'Missing expense amount',
        severity: 'ERROR',
        oldValue: row.amount,
      });
    }
    
    const amount = parseFloat(row.amount);
    if (isNaN(amount)) {
      anomalies.push({
        type: 'INVALID_AMOUNT',
        message: 'Invalid amount format',
        severity: 'ERROR',
        oldValue: row.amount,
      });
    } else if (amount <= 0) {
      anomalies.push({
        type: amount === 0 ? 'ZERO_AMOUNT' : 'NEGATIVE_AMOUNT',
        message: amount === 0 ? 'Amount cannot be zero' : 'Amount cannot be negative',
        severity: 'ERROR',
        oldValue: row.amount,
      });
    }
    
    if (!row.currency || row.currency === '') {
      anomalies.push({
        type: 'MISSING_CURRENCY',
        message: 'Missing currency',
        severity: 'WARNING',
        oldValue: row.currency,
      });
    }
    
    if (!row.paid_by || row.paid_by === '') {
      anomalies.push({
        type: 'MISSING_PAYER',
        message: 'Missing payer',
        severity: 'ERROR',
        oldValue: row.paid_by,
      });
    }
    
    if (!row.date || row.date === '') {
      anomalies.push({
        type: 'INVALID_DATE',
        message: 'Missing date',
        severity: 'ERROR',
        oldValue: row.date,
      });
    }
    
    return anomalies;
  }
  
  async getImportReport(importJobId: string) {
    return prisma.importJob.findUnique({
      where: { id: importJobId },
      include: {
        rows: {
          include: {
            anomalyReports: true,
          },
        },
      },
    });
  }
  
  async resolveAnomaly(anomalyId: string, isResolved: boolean, resolvedBy: string) {
    return prisma.anomalyReport.update({
      where: { id: anomalyId },
      data: {
        isResolved,
        resolvedBy,
        resolvedAt: new Date(),
      },
    });
  }
}

export const importService = new ImportService();