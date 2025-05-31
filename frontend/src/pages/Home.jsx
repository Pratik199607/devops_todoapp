import React from "react";
import { LuListTodo, LuArrowRight, LuCircleCheckBig } from "react-icons/lu";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "react-router-dom";

const Home = () => {
	const features = [
		{
			title: "Simple Task Management",
			description: "Create, update, and delete tasks with ease. Keep track of what's important.",
			icon: LuListTodo,
		},
		{
			title: "Smart Organization",
			description: "Search and filter your tasks to find exactly what you're looking for.",
			icon: LuCircleCheckBig,
		},
		{
			title: "Accessible Anywhere",
			description: "Access your tasks from any device with our responsive design.",
			icon: LuArrowRight,
		},
	];
	return (
		<>
			{/* Header section */}
			<header className="container mx-auto py-4 px-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
				<div className="flex items-center gap-2">
					<LuListTodo className="lucide lucide-list-todo h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
					<h1 className="text-xl sm:text-2xl font-bold">TaskMaster</h1>
				</div>

				<div className="flex items-center gap-3 sm:gap-4">
					<ThemeToggle />
					<Link
						to="/login"
						className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 sm:text-base sm:px-4"
					>
						Login
					</Link>
					<Link
						to="/register"
						className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 sm:text-base sm:px-4"
					>
						Get Started
					</Link>
				</div>
			</header>

			{/* Hero Section */}
			<main className="container mx-auto px-4 py-12">
				<section className="max-w-5xl mx-auto text-center mb-10 sm:mb-16 px-4">
					<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
						Organize your tasks with<span className="text-primary"> TaskMaster</span>
					</h2>
					<p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
						A simple, intuitive todo app that helps you stay organized and productive. Track your
						tasks, set priorities, and never miss a deadline again.
					</p>
					<Link
						to="/register"
						className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
					>
						Start for free
						<LuArrowRight />
					</Link>
				</section>

				{/* List section */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-10 sm:mb-16 px-4">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 shadow-neomorphic dark:shadow-neomorphic-dark border border-gray-100 dark:border-gray-700 transition-colors duration-300"
						>
							<div className="bg-primary/10 dark:bg-primary/20 p-2 sm:p-3 rounded-full w-fit mb-3 sm:mb-4">
								<feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
							</div>
							<h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
								{feature.title}
							</h3>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</section>

				{/* New Section */}
				<section className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 md:p-12 shadow-neomorphic dark:shadow-neomorphic-dark mx-4 sm:mx-auto border border-gray-100 dark:border-gray-700 transition-colors duration-300">
					<div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
								Ready to get organized?
							</h2>
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 leading-relaxed">
								Join thousands of users who have transformed their productivity with TaskMaster.
								Simple, powerful, and designed for you.
							</p>
							<Link
								to="/register"
								className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full sm:w-auto"
							>
								Create your account <LuArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
							</Link>
						</div>
						<div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 sm:p-6 shadow-inner transition-colors duration-300">
							<div className="space-y-3">
								{["Research project ideas", "Buy groceries", "Schedule team meeting"].map(
									(task, i) => (
										<div
											key={i}
											className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 transition-colors duration-300"
										>
											<LuCircleCheckBig
												className={`h-5 w-5 flex-shrink-0 ${
													i === 1 ? "text-primary" : "text-gray-300 dark:text-gray-600"
												}`}
											/>
											<span
												className={`text-sm sm:text-base ${
													i === 1
														? "line-through text-gray-400 dark:text-gray-500"
														: "text-gray-900 dark:text-gray-100"
												}`}
											>
												{task}
											</span>
										</div>
									)
								)}
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="container mx-auto py-6 sm:py-8 px-4 border-t border-gray-200 dark:border-gray-800 mt-8 sm:mt-12">
				<div className="flex flex-col sm:flex-row justify-between items-center">
					<div className="flex items-center gap-2 mb-3 sm:mb-0">
						<LuListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
						<span className="font-semibold text-gray-900 dark:text-gray-100">TaskMaster</span>
					</div>
					<p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
						© {new Date().getFullYear()} TaskMaster. All rights reserved.
					</p>
				</div>
			</footer>
		</>
	);
};

export default Home;
