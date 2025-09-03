import { oc } from '@orpc/contract';
import { ReportInsertSchema } from '@repo/database/models/reports';
import { z } from 'zod';

export const postReportContract = oc
  .route({
    method: 'POST',
    path: '/report',
    summary: 'Submit a new report',
  })
  .input(ReportInsertSchema);

export const postImageContract = oc
  .route({
    method: 'POST',
    path: '/image/{imageUuid}',
    summary: 'Submit an image for a report',
  })
  .input(
    z.object({
      imageUuid: z.string(),
      image: z.instanceof(Blob),
    }),
  );

export const reportsContract = {
  postReport: postReportContract,
  postImage: postImageContract,
};
