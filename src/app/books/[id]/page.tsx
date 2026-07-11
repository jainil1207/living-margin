type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Reading Canvas</h1>
      <p className="mt-3 text-slate-600">Book ID: {id}</p>
      <p className="mt-2 text-slate-600">This placeholder page will become your margin annotation experience.</p>
    </section>
  );
}
