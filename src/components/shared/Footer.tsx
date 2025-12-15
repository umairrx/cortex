import { Link } from "react-router-dom";
import blackLogo from "@/assets/black-logo.svg";
import whiteLogo from "@/assets/white-logo.svg";
import { useTheme } from "@/components/use-theme";
import { useLenisContext } from "@/contexts/LenisContext";

export function Footer() {
	const { scrollTo } = useLenisContext();

	return (
		<footer className="border-t border-border py-12">
			<div className="container mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<a href="/" className="flex items-center gap-2">
						<img
							src={useTheme().resolvedTheme === "dark" ? whiteLogo : blackLogo}
							alt="Cortex Logo"
							className="w-8 h-8 animate-[spin_3s_linear_infinite]"
						/>
						<span className="font-semibold text-lg">Cortex</span>
					</a>

					<div className="flex items-center gap-8">
						<Link
							to="/docs"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Documentation
						</Link>
						<a
							href="https://github.com/umairrx/cortex"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							GitHub
						</a>
						<a
							href="https://twitter.com/umairrx"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Twitter
						</a>
						<button
							onClick={() => scrollTo(0)}
							type="button"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Back to top
						</button>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t border-border text-center">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Cortex. Open source under MIT license.
					</p>
				</div>
			</div>
		</footer>
	);
}
