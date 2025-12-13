import { useLocation } from "react-router-dom";

const CollectionBuilds = () => {
  const location = useLocation();
  const type = location.pathname.split("/").pop();

  const formattedType = type
    ? type
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 space-y-1 border-b border-border w-full">
        <h1 className="font-medium text-lg">{formattedType} Collection</h1>
        <p className="text-sm text-foreground">
          Manage your {formattedType.toLowerCase()} collection here.
        </p>
      </div>
    </div>
  );
};

export default CollectionBuilds;
