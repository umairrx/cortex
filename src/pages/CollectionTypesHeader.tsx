import { Separator } from "@/components/ui/separator";

const CollectionTypesHeader = ({
  title,
  tagline,
}: {
  title: string;
  tagline: string;
}) => {
  return (
    <>
      <div className="space-y-1 px-4 mb-4">
        <h4>{title}</h4>
        <p className="text-xs text-muted-foreground">{tagline}</p>
      </div>
      <Separator />
    </>
  );
};

export default CollectionTypesHeader;
