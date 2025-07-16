import { db } from '@repo/database';
import { pub } from '../orpc';


export const postReport = pub.reports.postReport.handler(async ({input, context}) => {
  return await db.addReport(input);
});

export const reportsRouter = {
  postReport: postReport
};
