import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { useState } from "react"

export default function CreateUsers() {
	const [previewImage, setPreviewImage] = useState(null)

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewImage(reader.result)
			}
			reader.readAsDataURL(file)
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

							<div className="flex w-full">
								<div className="w-1/3 pr-4">
									<div className="mb-4">
										<label
											htmlFor="avatar"
											className="block mb-2 text-sm font-medium text-gray-700"
										>
											Avatar
										</label>
										<input
											type="file"
											id="avatar"
											name="avatar"
											accept="image/*"
											className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
											onChange={handleImageChange}
										/>
									</div>
									<div className="mt-2">
										<div className="flex items-center justify-center w-full h-64 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg">
											{previewImage ? (
												<img
													src={previewImage}
													alt="Preview"
													style={{
														objectFit: "contain",
													}}
													className="object-cover w-full h-full rounded-lg"
												/>
											) : (
												<span className="text-gray-500">Image preview</span>
											)}
										</div>
									</div>
								</div>

								{/* Right side - User data form */}
								<div className="w-2/3 pl-4">
									<form>
										<div className="mb-4">
											<label
												htmlFor="name"
												className="block mb-2 text-sm font-medium text-gray-700"
											>
												Name
											</label>
											<input
												type="text"
												id="name"
												name="name"
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div className="mb-4">
											<label
												htmlFor="email"
												className="block mb-2 text-sm font-medium text-gray-700"
											>
												Email
											</label>
											<input
												type="email"
												id="email"
												name="email"
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div className="mb-4">
											<label
												htmlFor="password"
												className="block mb-2 text-sm font-medium text-gray-700"
											>
												Password
											</label>
											<input
												type="password"
												id="password"
												name="password"
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div className="mb-4">
											<label
												htmlFor="password_confirmation"
												className="block mb-2 text-sm font-medium text-gray-700"
											>
												Confirm Password
											</label>
											<input
												type="password"
												id="password_confirmation"
												name="password_confirmation"
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>
										<div>
											<button
												type="submit"
												className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
											>
												Create User
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	)
}
