import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

const benefits = [
	"Your database stays the source of truth",
	"No vendor APIs in the read path",
	"No cold starts for content pages",
	"Works with Supabase, Postgres, MongoDB",
	"Can be removed without breaking your site",
	"Open source and self-hostable",
];

export function Solution() {
	return (
		<section className="relative py-24 md:py-32 overflow-hidden">
			<div className="absolute inset-0 bg-radial-fade opacity-50" />

			<div className="container mx-auto px-6 relative">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
							<Zap className="h-3.5 w-3.5" />
							<span className="text-sm font-medium">The solution</span>
						</div>

						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Cortex does
							<br />
							<span className="text-gradient">one thing well.</span>
						</h2>

						<p className="text-lg text-muted-foreground mb-8 ">
							Publish content directly where it belongs — in your database. No
							platform. No lock-in. Just your content, your way.
						</p>

						<ul className="space-y-4">
							{benefits.map((benefit, i) => (
								<motion.li
									key={benefit}
									initial={{ opacity: 0, x: -10 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: i * 0.1 }}
									className="flex items-center gap-3"
								>
									<div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
										<Check className="h-3 w-3 text-primary" />
									</div>
									<span className="text-foreground">{benefit}</span>
								</motion.li>
							))}
						</ul>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
					>
						<div className="relative rounded-2xl border border-border bg-card p-1 glow">
							<div className="rounded-xl bg-background overflow-hidden">
								<div className="flex items-center gap-2 px-4 py-3 border-b border-border">
									<div className="w-3 h-3 rounded-full bg-destructive/60" />
									<div className="w-3 h-3 rounded-full bg-yellow-500/60" />
									<div className="w-3 h-3 rounded-full bg-green-500/60" />
									<span className="ml-4 text-xs text-muted-foreground font-mono">
										cortex → your-database
									</span>
								</div>

								<div className="p-6 font-mono text-sm space-y-3">
									<div className="flex items-center gap-2">
										<span className="text-primary">$</span>
										<span className="text-foreground">cortex publish</span>
									</div>
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.5 }}
										className="text-muted-foreground"
									>
										<p>→ Connecting to database...</p>
										<p className="text-primary">✓ Connected to PostgreSQL</p>
									</motion.div>
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.8 }}
										className="text-muted-foreground"
									>
										<p>→ Writing 3 entries to "posts"...</p>
										<p className="text-primary">✓ Published successfully</p>
									</motion.div>
									<motion.div
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 1.1 }}
										className="text-green-400"
									>
										<p className="mt-2">
											Done! Content written directly to your DB.
										</p>
									</motion.div>
								</div>
							</div>
						</div>

						<motion.div
							animate={{ y: [0, -8, 0] }}
							transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
							className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg bg-surface-elevated border border-border shadow-xl"
						>
							<span className="text-sm font-medium text-primary">
								No APIs needed
							</span>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
