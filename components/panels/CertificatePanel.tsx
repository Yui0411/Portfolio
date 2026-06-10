import type { Certificate } from "@/types";

// Content shown in the detail panel when a certificate dot is selected.
export default function CertificatePanel({
  certificate,
}: {
  certificate: Certificate;
}) {
  return (
    <article className="flex flex-col gap-5">
      {/* Certificate image (placeholder box until image uploads are wired) */}
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-black/10 bg-foreground/[0.03] dark:border-white/15">
        {certificate.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.image_url}
            alt={certificate.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground/30">
            No image yet
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {certificate.name}
        </h2>
        <p className="text-foreground/70">{certificate.issuer}</p>
      </div>

      {certificate.verify_url && (
        <div>
          <a
            href={certificate.verify_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 dark:border-white/20"
          >
            Verify
          </a>
        </div>
      )}
    </article>
  );
}
