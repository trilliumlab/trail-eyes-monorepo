import { oc } from '@orpc/contract';
import { ReportInsertSchema } from '@repo/database/models/reports';
import { z } from 'zod/v4';

export const postReportContract = oc
  .route({ 
    method: 'POST', 
    path: '/report',
    summary: 'Submit a new report',
  })
  .input(ReportInsertSchema);

export const reportsContract = {
  postReport: postReportContract,
}
