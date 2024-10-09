import AdminLayout from "@/Layouts/AdminLayout"
import { Head, router } from "@inertiajs/react"
import { useForm, Controller } from "react-hook-form"
import { useState } from "react"
import TextInput from "@/Components/TextInput"
import InputLabel from "@/Components/InputLabel"
import { Tabs, Tab } from "@/Components/Tabs"
import BtnLoading from "@/Components/BtnLoading"
import ImageDrop from "@/Components/ImageDrop"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const userSchema = z
	.object({
		avatar: z.instanceof(File).optional(),
		username: z.string().min(3, "Username must be at least 3 characters"),
		user_code: z.string().min(1, "user_code is required"),
		first_name: z.string().min(3, "First name must be at least 3 characters"),
		last_name: z.string().min(3, "Last name must be at least 3 characters"),
		phone: z
			.string()
			.regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
			.optional(),
		gender: z.enum(["male", "female"]).default("male"),
		email: z.string().email("Invalid email"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirm_password: z.string().min(6, "Confirm Password is required"),
		address: z.string().optional(),
		city: z.string().optional(),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Password don't match",
		path: ["confirm_password"],
	})

export default function CreateUsers() {
	const [activeTab, setActiveTab] = useState(0)

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm({
		resolver: zodResolver(userSchema),
		defaultValues: {
			avatar: "",
			username: "username",
			user_code: "user_code",
			first_name: "firstName",
			last_name: "lastName",
			gender: "male",
			email: "email@gmail.com",
			password: "password",
			confirm_password: "password",
			address: "address",
			city: "city",
		},
	})

	const handleImageChange = (file) => {
		setValue("avatar", file)
	}

	const onSubmit = async (data) => {
		try {
			const formData = new FormData()
			for (const key in data) {
				if (key === "avatar" && data[key]) {
					formData.append("avatar", data[key])
				} else {
					formData.append(key, data[key])
				}
			}

			router.post(route("admin.users.store"), formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<AdminLayout header="Users">
			<Head title="Create User" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<h2 className="mb-4 text-2xl font-semibold">Create User</h2>

							<form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
								<div className="w-1/3 pr-4">
									<div className="mb-4">
										<ImageDrop onImageChange={handleImageChange} />
									</div>
								</div>

								<div className="w-2/3 pl-4">
									<Tabs activeTab={activeTab} onTabChange={setActiveTab}>
										<Tab label="Personal Information">
											<div className="space-y-4">
												<div className="flex space-x-4">
													<div className="flex-1">
														<InputLabel htmlFor="username" value="Username" required />
														<Controller
															name="username"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="username"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="Username"
																/>
															)}
														/>
														{errors.username && (
															<p className="text-red-500">{errors.username.message}</p>
														)}
													</div>
													<div className="flex-1">
														<InputLabel htmlFor="user_code" value="User Code" required />
														<Controller
															name="user_code"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="user_code"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="User Code"
																/>
															)}
														/>
														{errors.user_code && (
															<p className="text-red-500">{errors.user_code.message}</p>
														)}
													</div>
												</div>
												<div className="flex space-x-4">
													<div className="flex-1">
														<InputLabel htmlFor="firstName" value="First Name" required />
														<Controller
															name="first_name"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="first_name"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="First Name"
																/>
															)}
														/>
														{errors.first_name && (
															<p className="text-red-500">{errors.first_name.message}</p>
														)}
													</div>
													<div className="flex-1">
														<InputLabel htmlFor="lastName" value="Last Name" required />
														<Controller
															name="last_name"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="last_name"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="Last Name"
																/>
															)}
														/>
														{errors.last_name && (
															<p className="text-red-500">{errors.last_name.message}</p>
														)}
													</div>
												</div>
												<div className="flex space-x-4">
													<div className="flex-1">
														<InputLabel htmlFor="email" value="Email" required />
														<Controller
															name="email"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="email"
																	type="email"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="Email"
																/>
															)}
														/>
														{errors.email && (
															<p className="text-red-500">{errors.email.message}</p>
														)}
													</div>
													<div className="flex-1">
														<InputLabel htmlFor="phone" value="Phone" />
														<Controller
															name="phone"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="phone"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="Phone"
																/>
															)}
														/>
														{errors.phone && (
															<p className="text-red-500">{errors.phone.message}</p>
														)}
													</div>
												</div>

												<div className="flex space-x-4">
													<div className="flex-1">
														<InputLabel htmlFor="gender" value="Gender" />
														<Controller
															name="gender"
															control={control}
															render={({ field }) => (
																<select
																	id="gender"
																	{...field}
																	className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
																>
																	<option value="male">Male</option>
																	<option value="female">Female</option>
																</select>
															)}
														/>
														{errors.gender && (
															<p className="text-red-500">{errors.gender.message}</p>
														)}
													</div>
												</div>
												<div className="flex space-x-4">
													<div className="flex-1">
														<InputLabel htmlFor="password" value="Password" required />
														<Controller
															name="password"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="password"
																	type="password"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="Password"
																/>
															)}
														/>
														{errors.password && (
															<p className="text-red-500">{errors.password.message}</p>
														)}
													</div>
													<div className="flex-1">
														<InputLabel
															htmlFor="confirm_password"
															value="Confirm Password"
															required
														/>
														<Controller
															name="confirm_password"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="confirm_password"
																	type="password"
																	{...field}
																	className="mt-1 block w-full"
																	placeholder="Confirm Password"
																/>
															)}
														/>
														{errors.confirm_password && (
															<p className="text-red-500">
																{errors.confirm_password.message}
															</p>
														)}
													</div>
												</div>
											</div>
										</Tab>

										<Tab label="Address">
											<div className="space-y-4">
												<InputLabel htmlFor="address" value="Address" />
												<Controller
													name="address"
													control={control}
													render={({ field }) => (
														<TextInput
															id="address"
															{...field}
															className="mt-1 block w-full"
															placeholder="Address"
														/>
													)}
												/>
												{errors.address && (
													<p className="text-red-500">{errors.address.message}</p>
												)}
												<InputLabel htmlFor="city" value="City" />
												<Controller
													name="city"
													control={control}
													render={({ field }) => (
														<TextInput
															id="city"
															{...field}
															className="mt-1 block w-full"
															placeholder="City"
														/>
													)}
												/>
												{errors.city && <p className="text-red-500">{errors.city.message}</p>}
											</div>
										</Tab>
									</Tabs>

									<div className="mt-4">
										<BtnLoading
											type="submit"
											className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
											loading={isSubmitting}
										>
											Create User
										</BtnLoading>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	)
}
