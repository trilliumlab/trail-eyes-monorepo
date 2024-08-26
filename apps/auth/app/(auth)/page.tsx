'use server';

import { redirect, RedirectType } from 'next/navigation';

export default async function IndexPage() {
  throw redirect('/register', RedirectType.replace);
}
