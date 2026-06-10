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
import { deleteCertificate } from "./actions";
import type { Certificate } from "@/types";

export default async function AdminCertificatesList() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("display_order", { ascending: true });

  const items = (data ?? []) as Certificate[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
        <Button render={<Link href="/admin/certificates/new" />}>
          Add certificate
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No certificates yet. Add your first one.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="tabular-nums">
                  {item.display_order}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.issuer}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/admin/certificates/${item.id}/edit`} />
                      }
                    >
                      Edit
                    </Button>
                    <DeleteButton
                      action={deleteCertificate.bind(null, item.id)}
                    />
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
