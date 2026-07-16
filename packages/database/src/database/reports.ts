import { eq } from 'drizzle-orm';
import { client } from '~/db-client';
import type { ReportInsert, ReportSelect } from '~/models/reports';
import { reports } from '~/schema/reports';

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

/**
 * Retrieves all reports from the database.
 *
 * @returns A promise that resolves to an array of reports.
 */
export async function getAllReports() {
  return (await client.query.reports.findMany()) as ReportSelect[];
}
