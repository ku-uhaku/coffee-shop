import AdminLayout from "@/Layouts/AdminLayout"
import { Head, usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { toast } from "sonner"

export default function UsersIndex({ users }) {
	const { message } = usePage().props

	useEffect(() => {
		if (message) {
			toast.success(message)
		}
	}, [message])

	return (
		<AdminLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Users</h2>}>
			<Head title="Users" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<h3>Users List</h3>
							<div className="mt-6">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Avatar
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Name
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												Email
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												User Code
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{users.map((user) => (
											<tr key={user.id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex-shrink-0 h-10 w-10">
														{user.avatar ? (
															<img
																className="h-10 w-10 rounded-full"
																src={user.avatar}
																alt={user.username}
															/>
														) : (
															<div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
																<span className="text-gray-600">
																	{user.username.charAt(0).toUpperCase()}
																</span>
															</div>
														)}
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{user.username}
													</div>
													<div className="text-sm text-gray-500">{`${user.first_name} ${user.last_name}`}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">{user.email}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{user.user_code}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	)
}
