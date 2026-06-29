import { listHandler, createHandler } from "@/lib/crud";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { resource: string } }) {
  return listHandler(params.resource);
}
export async function POST(req: Request, { params }: { params: { resource: string } }) {
  return createHandler(params.resource, req);
}
