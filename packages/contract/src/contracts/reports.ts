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
      imageUuid: z.uuid(),
      image: z.instanceof(Blob),
    }),
  );

export const getImageContract = oc
  .route({
    method: 'GET',
    path: '/image/{imageUuid}',
    summary: 'Get an image for a report',
  })
  .input(z.object({ imageUuid: z.uuid() }))
  .output(z.instanceof(Blob));

export const patchReportStatusContract = oc
  .route({
    method: 'PATCH',
    path: '/report/{id}/status',
    summary: 'Approve/decline a report by updating its status. Requires a logged-in session.',
  })
  .input(
    z.object({
      id: z.coerce.number(),
      status: z.enum(['open', 'confirmed', 'inProgress', 'closed']),
    }),
  );

export const reportsContract = {
  postReport: postReportContract,
  postImage: postImageContract,
  getImage: getImageContract,
  patchReportStatus: patchReportStatusContract,
};
