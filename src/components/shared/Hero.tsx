import { motion } from "framer-motion";
import { ArrowRight, Database, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function Hero() {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
			<div className="absolute inset-0 bg-grid opacity-40" />
			<div className="absolute inset-0 bg-radial-fade" />

			<motion.div
				className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-linear-to-br from-primary/20 via-transparent to-transparent blur-3xl"
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<div className="relative z-10 container mx-auto px-6 py-20 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-glow bg-secondary/50 backdrop-blur-sm mb-8"
				>
					<span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
					<span className="text-sm font-medium text-muted-foreground">
						Open source & self-hostable
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
				>
					<span className="text-foreground">The </span>
					<span className="text-gradient">write-only</span>
					<br />
					<span className="text-foreground">CMS.</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
				>
					Author content in a beautiful UI. Publish directly to your database.
					<br className="hidden md:block" />
					No vendor APIs. No cold starts. No lock-in.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					<Button
						asChild
						size="lg"
						className="group glow-sm bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium"
					>
						<Link to="/signin">
							Get Started
							<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="px-8 h-12 text-base font-medium border-border hover:bg-secondary"
						asChild
					>
						<a
							href="https://github.com/umairrx/cortex"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github className="mr-2 h-4 w-4" />
							View on GitHub
						</a>
					</Button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.5 }}
					className="mt-16 pt-8"
				>
					<p className="text-sm text-muted-foreground mb-6">
						Works with your database
					</p>
					<div className="flex items-center justify-center gap-8 md:gap-12">
						{["Supabase", "PostgreSQL", "MongoDB"].map((db, i) => (
							<motion.div
								key={db}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
								className="flex items-center gap-2 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
							>
								<Database className="h-4 w-4" />
								<span className="text-sm font-medium">{db}</span>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
