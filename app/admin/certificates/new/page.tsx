import CertificateForm from "@/components/admin/CertificateForm";

export default function NewCertificatePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Add certificate</h1>
      <CertificateForm />
    </div>
  );
}
