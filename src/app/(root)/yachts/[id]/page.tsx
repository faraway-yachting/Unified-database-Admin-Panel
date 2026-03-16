import YachtsDetail from "@/components/Yachts/Details";

const Yachts = async ({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ edit?: string }>;
}) => {
    const { id } = await params;
    const { edit } = await searchParams;
    return (
        <div>
            <YachtsDetail id={id} defaultEdit={edit === "true"} />
        </div>
    );
};

export default Yachts;
