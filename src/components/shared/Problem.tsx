import { motion } from "framer-motion";
import {
	AlertTriangle,
	ArrowRightLeft,
	Cloud,
	Gauge,
	Layers,
	Lock,
} from "lucide-react";

const problems = [
	{
		icon: Cloud,
		title: "Content behind APIs",
		description:
			"Your content lives in someone else's infrastructure, accessed through their endpoints.",
	},
	{
		icon: Gauge,
		title: "Cold starts & latency",
		description:
			"Simple blog pages suffer from CMS API response times and cold start delays.",
	},
	{
		icon: Layers,
		title: "Schema lock-in",
		description:
			"Platforms dictate how your data should be structured, limiting flexibility.",
	},
	{
		icon: Lock,
		title: "Vendor dependency",
		description:
			"Your frontend depends on a CMS being online to serve any content.",
	},
	{
		icon: ArrowRightLeft,
		title: "Migration nightmare",
		description:
			"Moving away means restructuring your entire content architecture.",
	},
	{
		icon: AlertTriangle,
		title: "Hidden costs",
		description:
			"Pricing scales with usage, turning simple content updates into budget concerns.",
	},
];

export function Problem() {
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
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive mb-4">
						<AlertTriangle className="h-3.5 w-3.5" />
						<span className="text-sm font-medium">The problem</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-bold mb-4">
						Most CMSs don't just manage content.
						<br />
						<span className="text-muted-foreground">They own it.</span>
					</h2>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
					{problems.map((problem, i) => (
						<motion.div
							key={problem.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="group p-6 rounded-xl bg-surface border border-border hover:border-border/80 transition-all duration-300"
						>
							<div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
								<problem.icon className="h-5 w-5 text-destructive/80" />
							</div>
							<h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{problem.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
