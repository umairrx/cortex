import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "../hooks/useAuth.tsx";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

/**
 * Sign In page component for user authentication.
 * Provides a form for users to log in with email and password.
 * Handles authentication errors and redirects to dashboard on success.
 *
 * @returns The sign in page with authentication form
 */
export default function SignIn() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/dashboard";

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	/**
	 * Handles the login action for form submission.
	 * Calls the login function from auth context and handles success/error responses.
	 *
	 * @param _prevState - The previous state (unused).
	 * @param formData - The form data containing email and password.
	 * @returns The result of the login operation.
	 */
	const loginAction = async (
		_prevState: { success: boolean; error?: string },
		formData: { email: string; password: string },
	) => {
		const result = await login(formData.email, formData.password);
		if (result.success) {
			toast.success("Signed in successfully!");
			navigate(from, { replace: true });
		} else {
			toast.error(result.error || "Invalid email or password");
		}
		return result;
	};

	const [, dispatch, isPending] = useActionState(loginAction, {
		success: false,
	});

	/**
	 * Handles form submission for signin.
	 * Dispatches the login action with form values.
	 *
	 * @param values - The validated form values.
	 */
	async function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(() => {
			dispatch({ email: values.email, password: values.password });
		});
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>
						Enter your credentials to access your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="Enter your email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter your password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? (
									<>
										<Spinner className="mr-2" />
										Signing In...
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						Don't have an account?{" "}
						<Link to="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
