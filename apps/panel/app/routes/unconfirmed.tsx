import { createFileRoute } from '@tanstack/react-router';
import type { ReportInsert } from '@repo/database/models/reports';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';

export const Route = createFileRoute('/unconfirmed')({
  component: RouteComponent,
});

const mockReports: ReportInsert[] = [
  {
    // id is usually auto-generated, so omit on insert
    localId: '550e8400-e29b-41d4-a716-446655440000', // UUID string
    creatorDeviceId: 'device123',
    creatorUserId: 'user456',
    category: 'fallenTree',
    route: 1,
    trail: 2,
    image: 'https://example.com/images/fallen-tree.jpg',
    blurHash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    status: 'open',
    reportedAt: new Date(),
    updatedAt: new Date(),
    geometry: {
      coordinates: [-122.6765, 45.5231, 0],
      type: 'Point',
    },
  },
  {
    localId: '660e8400-e29b-41d4-a716-446655440001',
    creatorDeviceId: 'device789',
    creatorUserId: 'user101',
    category: 'damagedSign',
    route: 1,
    trail: 3,
    image: 'https://example.com/images/damaged-sign.jpg',
    blurHash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    status: 'confirmed',
    reportedAt: new Date(),
    updatedAt: new Date(),
    geometry: {
      coordinates: [-122.6828, 45.5152, 0],
      type: 'Point',
    },
  },
  {
   // localId: '770e8400-e29b-41d4-a716-446655440002',
    creatorDeviceId: 'device112',
    creatorUserId: 'user131',
    category: 'erosion',
    route: 2,
    trail: 5,
    image: 'https://example.com/images/erosion.jpg',
    blurHash: 'LLMF5k9Ft7M{00bHt7ay}4ofxuof',
    status: 'inProgress',
    reportedAt: new Date(),
    updatedAt: new Date(),
    geometry: {
      coordinates: [-122.6697, 45.5289, 0],
      type: 'Point',
    },
  },
];

type ReportKeys = keyof ReportInsert;

function RouteComponent() {
  return (
    <div className='px-6 py-4'>
        <h1 className='mt-6 text-center font-bold'>Unconfirmed Hazard Reports</h1>
        <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
          {mockReports.map((report) => (
            <Card key={report.localId}>
                <CardHeader className= "flex flex-row items-center justify-between space-y-0 pb-2 font-bold">
                  <CardTitle className="text-sm font-medium">Report</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col space-y-[20px]'>
              {/*    <p>Picture: {report.image}</p>*/}
                  <p>Catagory: {report.category}</p>
                  <p>Status: {report.status}</p>
                  <p>Route: {report.route}</p>
                  <p>Trail: {report.trail}</p>
                  <p>Reporter Device ID: {report.creatorDeviceId} </p>
                  <p>Reporter User ID: {report.creatorUserId} </p>
               {/*   <p>Reported: {report.reportedAt}</p>*/}
                  <div className='flex space-x-[16px]'>
                    <Button>Approve</Button>
                    <Button>Reject</Button>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}
