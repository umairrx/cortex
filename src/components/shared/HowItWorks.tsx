import { motion } from "framer-motion";
import { Database, PenLine, Rocket } from "lucide-react";

const steps = [
	{
		icon: PenLine,
		step: "01",
		title: "Author content",
		description:
			"Use the visual editor to create schemas, collections, and entries. No coding required.",
	},
	{
		icon: Database,
		step: "02",
		title: "Publish to database",
		description:
			"Click publish and Cortex writes your content directly to your Postgres, Supabase, or MongoDB.",
	},
	{
		icon: Rocket,
		step: "03",
		title: "Query anywhere",
		description:
			"Your frontend reads from your database. No CMS APIs. No cold starts. Just fast content.",
	},
];

export function HowItWorks() {
	return (
		<section className="relative py-24 md:py-32 overflow-hidden">
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-surface/50 to-transparent" />

			<div className="container mx-auto px-6 relative">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
					<p className="text-lg text-muted-foreground">
						Three simple steps to content freedom.
					</p>
				</motion.div>

				<div className="relative max-w-4xl mx-auto">
					<div className="grid lg:grid-cols-3 gap-8">
						{steps.map((step, i) => (
							<motion.div
								key={step.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: i * 0.2 }}
								className="relative text-center"
							>
								<div className="relative inline-block mb-6">
									<div className="w-20 h-20 rounded-full bg-surface border-2 border-border flex items-center justify-center">
										<step.icon className="h-8 w-8 text-primary" />
									</div>
									<span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
										{i + 1}
									</span>
								</div>

								<h3 className="text-xl font-semibold mb-3">{step.title}</h3>
								<p className="text-muted-foreground leading-relaxed">
									{step.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
