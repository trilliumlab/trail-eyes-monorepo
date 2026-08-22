import { eq } from 'drizzle-orm';
import { client } from '~/db-client';
import type { ReportInsert, ReportSelect, ReportUpdateInsert, ReportUpdateSelect } from '~/models/reports';
import { reportUpdates, reports } from '~/schema/reports';

/**
 * Adds a report to the database.
 *
 * @param report - The report to be added.
 * @returns A promise that resolves when the report is successfully added.
 */
export async function addReport(report: ReportInsert) {
  await client.insert(reports).values(report);
}

/**
 * Checks if an image is referenced by a report.
 *
 * @param imageUuid - The UUID of the image to check.
 * @returns A promise that resolves to true if the image is referenced by a report, false otherwise.
 */
export async function isImageReferenced(imageUuid: string) {
  const report = await client.query.reports.findFirst({
    where: eq(reports.image, imageUuid),
  });
  return !!report;
}

export async function getAllReports() {
  return (await client.query.reports.findMany()) as ReportSelect[];
}

export async function updateReportStatus(
  localId: string,
  status: ReportSelect['status'],
) {
  const [report] = await client
    .update(reports)
    .set({ status, updatedAt: new Date() })
    .where(eq(reports.localId, localId))
    .returning();

  return report as ReportSelect | undefined;
}

export async function addReportUpdate(update: ReportUpdateInsert) {
  const [reportUpdate] = await client.insert(reportUpdates).values(update).returning();
  return reportUpdate as ReportUpdateSelect;
}

export async function getReportUpdates(reportLocalId: string) {
  return (await client.query.reportUpdates.findMany({
    where: eq(reportUpdates.reportLocalId, reportLocalId),
  })) as ReportUpdateSelect[];
}