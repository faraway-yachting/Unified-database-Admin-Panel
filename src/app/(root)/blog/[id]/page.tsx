import BlogDetail from "@/components/Blog/BlogDetail";

const BlogDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) => {
  const { id } = await params;
  const { edit } = await searchParams;
  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 w-full overflow-x-hidden">
      <BlogDetail id={id} defaultEdit={edit === "true"} />
    </div>
  );
};

export default BlogDetailPage;
