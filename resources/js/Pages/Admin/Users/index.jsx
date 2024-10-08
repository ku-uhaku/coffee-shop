import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"

export default function Users({ users }) {
	return (
		<AdminLayout header="Users">
			<Head title="Users" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<h2 className="mb-4 text-2xl font-semibold">User List</h2>
							<ul>
								{users.map((user) => (
									<li key={user.id} className="mb-2">
										{user.name} - {user.email}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	)
}
