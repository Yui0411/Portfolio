import ExperienceForm from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Add experience</h1>
      <ExperienceForm />
    </div>
  );
}
