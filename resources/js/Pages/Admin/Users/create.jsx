import AdminLayout from "@/Layouts/AdminLayout"
import { Head, useForm } from "@inertiajs/react"
import { useState } from "react"
import TextInput from "@/Components/TextInput"
import InputLabel from "@/Components/InputLabel"
import { Tabs, Tab } from "@/Components/Tabs"
import BtnLoading from "@/Components/BtnLoading"
import ImageDrop from "@/Components/ImageDrop"
import { z } from "zod"

// Define schema using Zod
const userSchema = z.object({
	avatar: z.instanceof(File).optional(),
	username: z.string().min(1, "Username is required"),
	usercode: z.string().min(1, "User code is required"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().optional(),
	gender: z.enum(["male", "female"]),
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	confirmPassword: z.string().min(6, "Confirm Password is required"),
	address: z.string().optional(),
	city: z.string().optional(),
})

export default function CreateUsers() {
	const [activeTab, setActiveTab] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data, setData, post, errors } = useForm({
		avatar: null,
		username: "",
		usercode: "",
		firstName: "",
		lastName: "", 
		phone: "",
		gender: "",
		email: "",
		password: "",
			confirmPassword: "",
		address: "",
		city: "",
	})

	const handleImageChange = (file) => {
		setData("avatar", file);
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)
		try {
			// userSchema.parse(data) // Validate data using Zod schema
			
			// Simulate an API call
			await new Promise(resolve => setTimeout(resolve, 7000));

			console.log(data)
			// Handle successful submission here
		} catch (err) {
			if (err instanceof z.ZodError) {
				// Handle Zod validation errors
				console.log(err.errors)
			}
		} finally {
			setIsSubmitting(false)
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

							<form onSubmit={handleSubmit} className="flex w-full">
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
														<InputLabel htmlFor="username" value="Username" />
														<TextInput
															id="username"
															name="username"
															className="mt-1 block w-full"
															placeholder="Username"
															value={data.username}
															onChange={(e) => setData("username", e.target.value)}
															error={errors.username}
														/>
													</div>
													<div className="flex-1">
														<InputLabel htmlFor="usercode" value="User Code" />
														<TextInput
															id="usercode"
															name="usercode"
															className="mt-1 block w-full"
															placeholder="User Code"
															value={data.usercode}
															onChange={(e) => setData("usercode", e.target.value)}
															error={errors.usercode}
														/>
													</div>
												</div>
												{/* Additional input fields here */}
											</div>
										</Tab>

										<Tab label="Address">
											<div className="space-y-4">
												<InputLabel htmlFor="address" value="Address" />
												<TextInput
													id="address"
													name="address"
													className="mt-1 block w-full"
													placeholder="Address"
													value={data.address}
													onChange={(e) => setData("address", e.target.value)}
													error={errors.address}
												/>
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
