import { oc } from '@orpc/contract';
import {ReportInsertSchema, ReportSelectSchema, ReportUpdateSelectSchema,} from '@repo/database/models/reports';
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

export const postReportUpdateContract = oc
  .route({
    method: 'POST',
    path: '/report/{localId}/update',
    summary: 'Submit an update for a report',
  })
  .input(
    z.object({
      localId: z.uuid(),
      creatorDeviceId: z.string().min(1),
      state: z.enum(['present', 'cleared']),
      image: z.uuid().nullable().optional(),
      blurHash: z.string().nullable().optional(),
    }),
  )
  .output(ReportUpdateSelectSchema);

export const getReportUpdatesContract = oc
  .route({
    method: 'GET',
    path: '/report/{localId}/updates',
    summary: 'Get updates for a report',
  })
  .input(z.object({ localId: z.uuid() }))
  .output(z.array(ReportUpdateSelectSchema));

export const patchReportStatusContract = oc
  .route({
    method: 'PATCH',
    path: '/report/{localId}/status',
    summary: 'Update report status',
  })
  .input(
    z.object({
      localId: z.uuid(),
      status: z.enum(['open', 'confirmed', 'inProgress', 'closed']),
    }),
  )
  .output(ReportSelectSchema);

export const getReportsContract = oc
  .route({
    method: 'GET',
    path: '/report',
    summary: 'Get all reports',
  })
  .output(z.array(ReportSelectSchema));

export const reportsContract = {
  getReports: getReportsContract,
  postReport: postReportContract,
  postImage: postImageContract,
  getImage: getImageContract,
  postReportUpdate: postReportUpdateContract,
  getReportUpdates: getReportUpdatesContract,
  patchReportStatus: patchReportStatusContract,
};
