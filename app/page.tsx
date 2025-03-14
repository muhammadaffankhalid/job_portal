import Image from "next/image";
import List from "./List/page";
import { prisma } from "./prisma_client";

import { SessionProvider } from "next-auth/react";
import { getSession } from "next-auth/react";

export default async function Home() {
  const session = await getSession();
  const data = await prisma.jobs.findMany();
 
  return (
  <SessionProvider session={session}>
   <p>Welcome {session?.user?.email}</p>
  <List data={data} />
  </SessionProvider>
  );
}
