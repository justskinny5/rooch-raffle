import EditActivity from "@/components/activity/envelope/activity-edit/edit-envelope";

export default function EditEnvelopePage({ params }: { params: { id: string } }) {
    return <EditActivity id={params.id} />;
}
