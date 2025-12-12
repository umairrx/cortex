import type { ReactNode } from "react";

const CollectionBuilderLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex h-full w-full">{children}</div>;
};

export default CollectionBuilderLayout;
