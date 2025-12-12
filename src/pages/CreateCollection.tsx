import CollectionTypesHeader from "./CollectionTypesHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FileText, Edit, Calendar, Image as ImageIcon } from "lucide-react";
import FieldCard from "@/components/FieldCard";

export interface FieldType {
  type: string;
  label: string;
  maxLength?: number;
}

const CreateCollection = () => {
  const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>(
    {}
  );
  const [search, setSearch] = useState("");

  const getIcon = (name: string) => {
    switch (name) {
      case "Text":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "Rich Content":
        return <Edit className="h-4 w-4 text-muted-foreground" />;
      case "Date":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case "Image":
        return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const collectionFields: { name: string; types: FieldType[] }[] = [
    {
      name: "Text",
      types: [
        { type: "short", label: "Short Text", maxLength: 100 },
        { type: "long", label: "Long Text", maxLength: 300 },
      ],
    },
    {
      name: "Rich Content",
      types: [
        { type: "richtext", label: "Rich Text" },
        { type: "richmarkdown", label: "Rich Markdown" },
      ],
    },
    {
      name: "Date",
      types: [{ type: "date", label: "Date" }],
    },
    {
      name: "Image",
      types: [
        { type: "single", label: "Single Image" },
        { type: "multiple", label: "Multiple Images" },
      ],
    },
  ];

  const handleTypeSelect = (fieldName: string, type: string) => {
    setSelectedTypes((prev) => ({ ...prev, [fieldName]: type }));
  };

  const filteredFields = collectionFields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="flex w-full justify-between">
        <div className="w-1/2 py-3 border-r">
          <CollectionTypesHeader
            title="New Collection Type"
            tagline="Define a new collection type"
          />
          <div className="px-4 py-3 space-y-4">
            <Input
              placeholder="Search fields..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            {filteredFields.map((fieldGroup) => (
              <FieldCard
                key={fieldGroup.name}
                fieldGroup={fieldGroup}
                selectedTypes={selectedTypes}
                handleTypeSelect={handleTypeSelect}
                getIcon={getIcon}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 py-3">
          <CollectionTypesHeader
            title="Selected Collection Type"
            tagline="Review your selected fields"
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CreateCollection;
