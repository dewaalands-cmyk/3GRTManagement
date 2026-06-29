import { updateHandler, deleteHandler } from "@/lib/crud";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { resource: string; id: string } }) {
  return updateHandler(params.resource, params.id, req);
}
export async function DELETE(_req: Request, { params }: { params: { resource: string; id: string } }) {
  return deleteHandler(params.resource, params.id);
}
