import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import {
	Snippet,
	SnippetCopyButton,
	SnippetHeader,
	SnippetTabsContent,
	SnippetTabsList,
	SnippetTabsTrigger,
} from "@/components/kibo-ui/snippet";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function Docs() {
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main>
				<section className="bg-linear-to-b from-surface to-card border-b border-border py-32">
					<div className="container mx-auto px-6">
						<div className="max-w-4xl mx-auto text-center">
							<h1 className="text-4xl md:text-6xl font-bold mb-4">
								Documentation
							</h1>
							<p className="text-lg text-muted-foreground mb-6">
								Everything you need to know to get Cortex running and
								extensible.
							</p>
							<div className="flex items-center justify-center gap-3">
								<Button asChild size="lg" className="px-6">
									<Link to="/signin">Get Started</Link>
								</Button>
								<Button asChild variant="outline" size="lg" className="px-6">
									<a
										href="https://github.com/umairrx/cortex"
										target="_blank"
										rel="noopener noreferrer"
									>
										View on GitHub
									</a>
								</Button>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12">
					<div className="container mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							className="max-w-6xl mx-auto"
						>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
								<nav className="order-2 md:order-1 md:col-span-1 sticky top-24 self-start">
									<div className="rounded-md border border-border bg-card p-4">
										<h4 className="font-semibold mb-3">On this page</h4>
										<ul className="space-y-2 text-sm">
											<li>
												<a
													href="#getting-started"
													className="text-muted-foreground hover:text-foreground"
												>
													Getting started
												</a>
											</li>
											<li>
												<a
													href="#installation"
													className="text-muted-foreground hover:text-foreground"
												>
													Installation
												</a>
											</li>
											<li>
												<a
													href="#usage"
													className="text-muted-foreground hover:text-foreground"
												>
													Usage
												</a>
											</li>
											<li>
												<a
													href="#api"
													className="text-muted-foreground hover:text-foreground"
												>
													API
												</a>
											</li>
											<li>
												<Link
													to="/signup"
													className="text-muted-foreground hover:text-foreground"
												>
													Create an account
												</Link>
											</li>
										</ul>
									</div>
								</nav>

								<article className="order-1 md:order-2 md:col-span-3 prose prose-neutral max-w-none">
									<div className="flex items-start justify-between">
										<div>
											<h2
												id="getting-started"
												className="text-2xl md:text-3xl font-bold"
											>
												Getting started
											</h2>
											<p className="text-muted-foreground mt-2">
												A quick guide to get Cortex up and running.
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Button asChild size="sm" variant="ghost">
												<a
													href="https://github.com/umairrx/cortex"
													target="_blank"
													rel="noopener noreferrer"
												>
													Edit on GitHub
												</a>
											</Button>
										</div>
									</div>

									<section id="installation">
										<h3 className="mt-6">Installation</h3>
										<p>Clone the repo and install dependencies:</p>
										<Snippet className="relative mt-2" defaultValue="bash">
											<SnippetHeader>
												<SnippetTabsList>
													<SnippetTabsTrigger value="bash">
														bash
													</SnippetTabsTrigger>
												</SnippetTabsList>
												<SnippetCopyButton
													value={`git clone https://github.com/umairrx/cortex.git\ncd cortex\npnpm install\npnpm dev`}
												/>
											</SnippetHeader>
											<SnippetTabsContent value="bash">
												{`git clone https://github.com/umairrx/cortex.git\ncd cortex\npnpm install\npnpm dev`}
											</SnippetTabsContent>
										</Snippet>

										<div className="mt-4">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium">
													Install UI components
												</span>
												<SnippetCopyButton
													value={
														"pnpm dlx shadcn@latest add @shadcn/button @shadcn/card"
													}
													asChild
												>
													<Button size="sm" variant="ghost">
														Copy
													</Button>
												</SnippetCopyButton>
											</div>

											<Snippet defaultValue="bash">
												<SnippetHeader>
													<SnippetTabsList>
														<SnippetTabsTrigger value="bash">
															bash
														</SnippetTabsTrigger>
													</SnippetTabsList>
												</SnippetHeader>
												<SnippetTabsContent value="bash">
													{`pnpm dlx shadcn@latest add @shadcn/button @shadcn/card`}
												</SnippetTabsContent>
											</Snippet>
										</div>
									</section>

									<section id="usage">
										<h3 className="mt-6">Usage</h3>
										<p>
											The app contains a dashboard and content manager. Sign in
											to get started and create collections, then publish your
											content.
										</p>
										<div className="mt-4">
											<h4 className="font-semibold">Routes</h4>
											<ul>
												<li>
													<code>/signin</code> — Sign in page
												</li>
												<li>
													<code>/signup</code> — Create an account
												</li>
												<li>
													<code>/dashboard</code> — Main app (requires auth)
												</li>
											</ul>
										</div>
									</section>

									<section id="api">
										<h3 className="mt-6">API</h3>
										<p>
											The backend exposes REST endpoints for auth and content.
											See the backend repository for full API docs:{" "}
											<a
												href="https://github.com/umairrx/cortex-backend"
												target="_blank"
												rel="noopener noreferrer"
											>
												cortex-backend
											</a>
											.
										</p>
									</section>

									<section id="contributing">
										<h3 className="mt-6">Contributing</h3>
										<p>
											Contributions are welcome — please see the{" "}
											<a href="/CONTRIBUTING.md">contributing guide</a> for
											details.
										</p>
									</section>
								</article>
							</div>
						</motion.div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
