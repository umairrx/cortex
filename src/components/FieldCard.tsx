import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { FieldType } from "../pages/CreateCollection";

interface FieldCardProps {
  fieldGroup: { name: string; types: FieldType[] };
  selectedTypes: Record<string, string>;
  handleTypeSelect: (fieldName: string, type: string) => void;
  getIcon: (name: string) => ReactNode;
  onAdd: (fieldName: string, type: string) => void;
}

const FieldCard = ({
  fieldGroup,
  selectedTypes,
  handleTypeSelect,
  getIcon,
  onAdd,
}: FieldCardProps) => {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          {fieldGroup.types.length > 1 ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getIcon(fieldGroup.name)}
                    <div>
                      <div className="text-sm font-medium">
                        {fieldGroup.name}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedTypes[fieldGroup.name]
                          ? fieldGroup.types.find(
                              (t) => t.type === selectedTypes[fieldGroup.name]
                            )?.label
                          : "Select type"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose {fieldGroup.name} Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {fieldGroup.types.map((field) => (
                    <div
                      key={field.type}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedTypes[fieldGroup.name] === field.type
                          ? "bg-accent border-primary"
                          : "hover:bg-accent"
                      }`}
                      onClick={() =>
                        handleTypeSelect(fieldGroup.name, field.type)
                      }
                    >
                      <div className="text-sm font-medium">{field.label}</div>
                      {field.maxLength && (
                        <p className="text-xs text-muted-foreground">
                          Max Length: {field.maxLength} characters
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() =>
                        onAdd(
                          fieldGroup.name,
                          selectedTypes[fieldGroup.name] ||
                            fieldGroup.types[0].type
                        )
                      }
                    >
                      Add
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <div
              className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition flex items-center justify-between"
              onClick={() => {
                handleTypeSelect(fieldGroup.name, fieldGroup.types[0].type);
                onAdd(fieldGroup.name, fieldGroup.types[0].type);
              }}
            >
              <div className="flex items-center space-x-3">
                {getIcon(fieldGroup.name)}
                <div>
                  <div className="text-sm font-medium">{fieldGroup.name}</div>
                  <p className="text-xs text-muted-foreground">
                    {selectedTypes[fieldGroup.name]
                      ? fieldGroup.types.find(
                          (t) => t.type === selectedTypes[fieldGroup.name]
                        )?.label
                      : "Select type"}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Click to select {fieldGroup.name}
            {fieldGroup.types.length > 1
              ? ` type. ${fieldGroup.types.length} options available.`
              : "."}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default FieldCard;
