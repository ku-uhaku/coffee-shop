import { useEffect, useState } from "react"
import { usePage } from "@inertiajs/react"
import { toast } from "sonner"
import Navigation from "@/Components/Navigation"
import Sidebar from "@/Components/Sidebar"
import change from "../../../public/sound/change.mp3"


export default function AdminLayout({ header, children }) {
	const { flash, sound } = usePage().props
	const [sidebarOpen, setSidebarOpen] = useState(true)

	useEffect(() => {
		if (flash.success) {
			toast.success(flash.success)
		}

		if (flash.error) {
			toast.error(flash.error)
		}
	}, [flash.success, flash.error])

	useEffect(() => {
		if (sound == 'create') {
			const audio = new Audio(change)
			audio.play()
		}
	}, [sound])

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar isOpen={sidebarOpen} />

			<div className={`flex-1 flex flex-col transition-all duration-300`}>
				<Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

				<div className="flex-1 overflow-auto">
					{header && (
						<header className="bg-white shadow">
							<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
						</header>
					)}

					<main className="flex-1">{children}</main>
				</div>
			</div>
		</div>
	)
}