import { motion } from "framer-motion";
import { ArrowRight, Github, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function CTA() {
	return (
		<section className="relative py-24 md:py-32">
			<div className="container mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="relative max-w-4xl mx-auto"
				>
					<div className="relative rounded-3xl border border-border bg-linear-to-b from-surface to-card p-12 md:p-16 text-center overflow-hidden">
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />

						<div className="relative">
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								whileInView={{ scale: 1, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
							>
								<Star className="h-4 w-4" />
								<span className="text-sm font-medium">
									Open for collaboration
								</span>
							</motion.div>

							<h2 className="text-3xl md:text-5xl font-bold mb-4">
								Ready to own your content?
							</h2>

							<p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
								Cortex is open source and free to use. Start publishing content
								to your database today.
							</p>

							<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
								<Button
									asChild
									size="lg"
									className="group glow bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium"
								>
									<Link to="/signin">
										Get Started Free
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
										Star on GitHub
									</a>
								</Button>
							</div>

							<p className="mt-8 text-sm text-muted-foreground">
								Still early, but excited to build together.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
