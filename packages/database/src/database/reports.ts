import { eq } from 'drizzle-orm';
import { client } from '~/db-client';
import type { ReportInsert, ReportSelect } from '~/models/reports';
import { reports } from '~/schema/reports';
import { users } from '~/schema/auth';

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
 * Updates a report's status (e.g. approve/decline from the panel).
 *
 * @param id - The report id.
 * @param status - The new status.
 */
export async function updateReportStatus(id: number, status: ReportSelect['status']) {
  await client
    .update(reports)
    .set({ status, updatedAt: new Date() })
    .where(eq(reports.id, id));
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

/**
 * Retrieves all reports along with the reporting account's email, if the
 * report was created by a logged-in account (creatorUserId is set).
 *
 * @returns A promise that resolves to an array of reports with creatorEmail attached.
 */
export async function getAllReportsWithCreatorEmail() {
  const rows = await client
    .select({ report: reports, creatorEmail: users.email })
    .from(reports)
    .leftJoin(users, eq(reports.creatorUserId, users.id));

  return rows.map(({ report, creatorEmail }) => ({
    ...(report as ReportSelect),
    creatorEmail,
  }));
}
