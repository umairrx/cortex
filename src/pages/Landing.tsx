import { CTA } from "@/components/shared/CTA";
import { Features } from "@/components/shared/Features";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/shared/Hero";
import { HowItWorks } from "@/components/shared/HowItWorks";
import { Navbar } from "@/components/shared/Navbar";
import { Problem } from "@/components/shared/Problem";
import { Solution } from "@/components/shared/Solution";

export default function Landing() {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main>
				<Hero />
				<Problem />
				<Solution />
				<section id="features">
					<Features />
				</section>
				<section id="how-it-works">
					<HowItWorks />
				</section>
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
