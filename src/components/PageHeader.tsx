interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-6 pb-4">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
