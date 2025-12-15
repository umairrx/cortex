import { motion } from "framer-motion";
import { Github, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import blackLogo from "@/assets/black-logo.svg";
import whiteLogo from "@/assets/white-logo.svg";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeColorSwitcher } from "@/components/theme-color-switcher";
import { useTheme } from "@/components/use-theme";
import { Button } from "../ui/button";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { resolvedTheme } = useTheme();

	const logoSrc = resolvedTheme === "dark" ? whiteLogo : blackLogo;
	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 left-0 right-0 z-50"
		>
			<div className="mx-auto px-6 py-4">
				<div className="flex items-center justify-between max-w-6xl mx-auto rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl px-6 py-3">
					<a href="/" className="flex items-center gap-3">
						<img
							src={logoSrc}
							alt="Cortex DB Logo"
							className="h-8 w-auto animate-[spin_3s_linear_infinite]"
						/>
						<span className="font-semibold">Cortex DB</span>
					</a>
					{/* Desktop nav */}
					<div className="hidden md:flex items-center gap-8">
						<a
							href="#features"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Features
						</a>
						<a
							href="#how-it-works"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							How it works
						</a>
						<Link to="/docs">Docs</Link>
					</div>

					<div className="hidden md:flex items-center gap-3">
						<div className="flex items-center gap-2">
							<ThemeColorSwitcher />
							<ModeToggle />
						</div>
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="text-muted-foreground hover:text-foreground"
						>
							<a
								href="https://github.com/umairrx/cortex"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-4 w-4 mr-2" />
								GitHub
							</a>
						</Button>
						<Button
							asChild
							size="sm"
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							<Link to="/signin">Get Started</Link>
						</Button>
					</div>

					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="md:hidden p-2 text-muted-foreground hover:text-foreground"
					>
						<Menu className="h-5 w-5" />
					</button>
				</div>

				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="md:hidden mt-2 mx-auto max-w-6xl rounded-xl border border-border bg-card p-4"
					>
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-end gap-2">
								<ThemeColorSwitcher />
								<ModeToggle />
							</div>
							<a
								href="#features"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
							>
								Features
							</a>
							<a
								href="#how-it-works"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
							>
								How it works
							</a>
							<Link
								to="/docs"
								className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
							>
								Docs
							</Link>
							<hr className="border-border" />
							<Button
								asChild
								size="sm"
								className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Link to="/signin">Get Started</Link>
							</Button>
						</div>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
}
