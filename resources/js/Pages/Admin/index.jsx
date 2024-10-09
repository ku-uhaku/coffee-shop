import AdminLayout from "@/Layouts/AdminLayout"
import { Head, usePage } from "@inertiajs/react"

function Admin() {
	return (
		<AdminLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}>
			<Head title="Admin" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className=" bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">Admin</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	)
}

export default Admin
