import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProject } from "./actions";
import type { Project } from "@/types";

export default async function AdminProjectsList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  const items = (data ?? []) as Project[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <Button render={<Link href="/admin/projects/new" />}>
          Add project
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects yet. Add your first one.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="tabular-nums">
                  {item.display_order}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  {item.is_visible ? (
                    <Badge variant="secondary">Visible</Badge>
                  ) : (
                    <Badge variant="outline">Hidden</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/admin/projects/${item.id}/edit`} />}
                    >
                      Edit
                    </Button>
                    <DeleteButton action={deleteProject.bind(null, item.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
