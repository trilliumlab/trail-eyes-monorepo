import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { publicEnv } from '@repo/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { Button } from '@repo/ui/components/button';
import { requireAdmin } from '~/lib/require-staff';

export const Route = createFileRoute('/pending-staff')({
  beforeLoad: requireAdmin,
  component: RouteComponent,
});

interface PendingStaffAccount {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

function RouteComponent() {
  const [pending, setPending] = useState<PendingStaffAccount[] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${publicEnv().backendUrl}/users/pending-staff`, { credentials: 'include' })
      .then((res) => res.json())
      .then(setPending);
  }, []);

  async function approve(id: string) {
    setActionError(null);
    const res = await fetch(`${publicEnv().backendUrl}/users/${id}/approve`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      setActionError('Failed to approve this account.');
      return;
    }
    setPending((prev) => prev?.filter((p) => p.id !== id) ?? null);
  }

  return (
    <div className="px-6 py-4">
      <h1 className="mt-6 text-center font-bold">Pending Staff Approvals</h1>
      {actionError && <p className="text-center text-destructive mt-2">{actionError}</p>}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Verified staff signups awaiting approval</CardTitle>
          <CardDescription>
            These accounts verified their email and picked "Park Staff" at signup, but need admin
            approval before they get staff access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Signed up</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending === null ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              ) : pending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No pending staff signups.</TableCell>
                </TableRow>
              ) : (
                pending.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => approve(account.id)}>Approve</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
