import { oc } from '@orpc/contract';
import { ReportInsertSchema, ReportSelectSchema } from '@repo/database/models/reports';
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

// NOTE (proposal — needs Elliot's sign-off): who is allowed to change a report's
// status? Right now every procedure is `pub` (public/unauthenticated). Status changes
// are primarily an admin/volunteer action from the panel, so this most likely wants to
// move to an authenticated procedure once panel auth is wired (`authed` in orpc.ts).
// Keyed on `localId` (the client-generated UUID) so both the app and panel can address
// a report without knowing its serial `id` — mirrors the image-upload UUID pattern.
export const updateReportStatusContract = oc
  .route({
    method: 'PATCH',
    path: '/report/{localId}/status',
    summary: "Update a report's status",
  })
  .input(
    z.object({
      localId: z.uuid(),
      status: ReportSelectSchema.shape.status,
    }),
  )
  .output(ReportSelectSchema);

export const reportsContract = {
  postReport: postReportContract,
  postImage: postImageContract,
  getImage: getImageContract,
  updateReportStatus: updateReportStatusContract,
};
