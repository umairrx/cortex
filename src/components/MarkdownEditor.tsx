import { useTheme } from "@/components/use-theme";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface MarkdownEditorProps {
	value: string | null | undefined;
	onChange: (value: string | undefined) => void;
	height?: number;
}

export default function MarkdownEditor({
	value,
	onChange,
	height = 500,
}: MarkdownEditorProps) {
	const { resolvedTheme } = useTheme();

	return (
		<div
			data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
			style={
				{
					"--color-canvas-default": "var(--background)",
					"--color-canvas-subtle": "var(--muted)",
					"--color-border-default": "var(--border)",
					"--color-border-muted": "var(--border)",
					"--color-fg-default": "var(--foreground)",
					"--color-fg-muted": "var(--muted-foreground)",
					"--color-accent-fg": "var(--primary)",
					"--color-accent-emphasis": "var(--primary)",
					"--color-accent-subtle": "var(--secondary)",
					"--wmde-editor-background": "var(--background)",
					"--wmde-editor-color": "var(--foreground)",
				} as React.CSSProperties
			}
			className="[&_.w-md-editor-toolbar]:bg-muted [&_.w-md-editor-toolbar]:border-border [&_.w-md-editor-content]:bg-card [&_.w-md-editor]:border-border [&_.w-md-editor]:shadow-none"
		>
			<MDEditor
				value={value || ""}
				onChange={onChange}
				height={height}
				preview="live"
				className="border! rounded-md! overflow-hidden"
				textareaProps={{
					placeholder: "Type your markdown here...",
				}}
			/>
		</div>
	);
}
