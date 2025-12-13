import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

const formSchema = z
	.object({
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z.string().min(6, {
			message: "Password must be at least 6 characters.",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

/**
 * Sign Up page component for user registration.
 * Provides a form for new users to create an account with email and password.
 * Validates password confirmation and handles registration errors.
 *
 * @returns The sign up page with registration form
 */
export default function SignUp() {
	const { signup } = useAuth();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	/**
	 * Handles the signup action for form submission.
	 * Calls the signup function from auth context and handles success/error responses.
	 *
	 * @param _prevState - The previous state (unused).
	 * @param formData - The form data containing email and password.
	 * @returns The result of the signup operation.
	 */
	const signupAction = async (
		_prevState: { success: boolean; error?: string },
		formData: { email: string; password: string },
	) => {
		const result = await signup(formData.email, formData.password);
		if (result.success) {
			toast.success("Account created successfully!");
			setTimeout(() => navigate("/dashboard"), 1000);
		} else {
			toast.error(result.error || "Failed to create account");
		}
		return result;
	};

	const [, dispatch, isPending] = useActionState(signupAction, {
		success: false,
	});

	/**
	 * Handles form submission for signup.
	 * Dispatches the signup action with form values.
	 *
	 * @param values - The validated form values.
	 */
	async function onSubmit(values: z.infer<typeof formSchema>) {
		dispatch({ email: values.email, password: values.password });
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>
						Create a new account to get started.
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
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Confirm your password"
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
										Signing Up...
									</>
								) : (
									"Sign Up"
								)}
							</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link to="/signin" className="text-primary hover:underline">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
