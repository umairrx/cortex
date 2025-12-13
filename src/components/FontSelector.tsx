import { Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const fonts = [
	{ name: "Inter", value: "inter" },
	{ name: "Raleway", value: "raleway" },
	{ name: "Roboto", value: "roboto" },
	{ name: "Open Sans", value: "open-sans" },
	{ name: "Lato", value: "lato" },
	{ name: "Montserrat", value: "montserrat" },
	{ name: "Poppins", value: "poppins" },
];

/**
 * Font selector component that allows users to change the application font.
 * Displays available fonts in a dropdown and persists the selection to localStorage.
 * Applies the selected font to the entire application.
 *
 * @returns A button with dropdown menu for font selection
 */
export default function FontSelector() {
	const [selectedFont, setSelectedFont] = useState(() => {
		return localStorage.getItem("selectedFont") || "raleway";
	});

	useEffect(() => {
		const fontMap = {
			inter: "'Inter', sans-serif",
			raleway: "'Raleway', sans-serif",
			roboto: "'Roboto', sans-serif",
			"open-sans": "'Open Sans', sans-serif",
			lato: "'Lato', sans-serif",
			montserrat: "'Montserrat', sans-serif",
			poppins: "'Poppins', sans-serif",
		};
		const fontFamily =
			fontMap[selectedFont as keyof typeof fontMap] || "'Raleway', sans-serif";
		document.body.style.fontFamily = fontFamily;
		localStorage.setItem("selectedFont", selectedFont);
	}, [selectedFont]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Type className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Toggle font</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{fonts.map((font) => (
					<DropdownMenuItem
						key={font.value}
						onClick={() => setSelectedFont(font.value)}
						className={selectedFont === font.value ? "bg-accent" : ""}
					>
						{font.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
