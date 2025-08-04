import { db } from '@repo/database';
import { pub } from '../orpc';

/*
export const postReport = pub.reports.postReport.handler(async ({input, context}) => {
  return await db.addReport(input);
});
*/

export const postReport = pub.reports.postReport.handler(async ({input, context}) => {
  const savedReport = await db.addReport(input);

  return {
    status:"created",
    report: savedReport ?? input,
  };
});
export const reportsRouter = {
  postReport: postReport,
};

/*

(parameter) input: {
    creatorDeviceId: string;
    category: "other" | "fallenTree" | "drainage" | "erosion" | "structureFailure" | "damagedSign" | "seasonal";
    route: number;
    trail: number;
    geometry: {
        coordinates: [number, number, number];
        type: "Point";
    };
    id?: number | undefined;
    localId?: string | null | undefined;
    creatorUserId?: string | null | undefined;
    image?: string | null | undefined;
    blurHash?: string | null | undefined;
    status?: "open" | "confirmed" | "inProgress" | "closed" | undefined;
    reportedAt?: Date | undefined;
    updatedAt?: Date | undefined;
}

*/