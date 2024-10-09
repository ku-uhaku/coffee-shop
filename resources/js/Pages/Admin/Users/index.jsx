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
							<div className="mt-6"></div>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	)
}
