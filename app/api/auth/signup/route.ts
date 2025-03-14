import { prisma } from "@/app/prisma_client";
import { NextApiRequest, NextApiResponse } from "next";
import { compare, hash } from "bcryptjs";
export  async function POST (req: Request
) {
  const  { email, password,role } = await req.json();
  console.log(prisma.users); 
  await prisma.users.create({ 
    data:{
        email,
        password: await hash(password, 10),
        role,
    }
  })
  return new Response("User created", { status: 200 });
}
