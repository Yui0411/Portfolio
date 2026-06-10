import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteExperience } from "./actions";
import { formatDateRange } from "@/lib/format";
import type { Experience } from "@/types";

export default async function AdminExperienceList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  const items = (data ?? []) as Experience[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
        <Button render={<Link href="/admin/experience/new" />}>
          Add experience
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No experience yet. Add your first one.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="tabular-nums">
                  {item.display_order}
                </TableCell>
                <TableCell className="font-medium">{item.company}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateRange(item.start_date, item.end_date)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/admin/experience/${item.id}/edit`} />
                      }
                    >
                      Edit
                    </Button>
                    <DeleteButton action={deleteExperience.bind(null, item.id)} />
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
