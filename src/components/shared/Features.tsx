import { motion } from "framer-motion";
import {
	Box,
	Code2,
	Layers,
	MousePointerClick,
	Plug,
	Shield,
} from "lucide-react";

const features = [
	{
		icon: Layers,
		title: "Visual Schema Builder",
		description:
			"Create collection schemas by selecting fields in the UI. No code required for content modeling.",
	},
	{
		icon: MousePointerClick,
		title: "Intuitive Editor",
		description:
			"A clean, focused writing experience. Create and manage entries entirely through the interface.",
	},
	{
		icon: Code2,
		title: "Database Native",
		description:
			"Content goes straight to your database. Query it however you want with your existing tools.",
	},
	{
		icon: Shield,
		title: "Self-Hostable",
		description:
			"Run Cortex on your own infrastructure. Complete control over your CMS and data.",
	},
	{
		icon: Plug,
		title: "Zero Dependency",
		description:
			"Remove Cortex anytime without breaking your site. Your content stays in your database.",
	},
	{
		icon: Box,
		title: "Open Source",
		description:
			"MIT licensed and open for collaboration. Contribute, extend, and make it yours.",
	},
];

export function Features() {
	return (
		<section className="relative py-24 md:py-32">
			<div className="container mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-5xl font-bold mb-4">
						Built for developers who
						<br />
						<span className="text-gradient">value simplicity.</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Everything you need to author content, nothing you don't.
					</p>
				</motion.div>

				{/* Features grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="group relative p-6 rounded-2xl bg-linear-to-b from-surface to-transparent border border-border hover:border-primary/30 transition-all duration-500"
						>
							<div className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

							<div className="relative">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
									<feature.icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
