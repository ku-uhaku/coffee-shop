import "../css/app.css"
import "./bootstrap"

import { createInertiaApp } from "@inertiajs/react"
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers"
import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"

const appName = import.meta.env.VITE_APP_NAME || "Coffee"

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob("./Pages/**/*.jsx")),
	setup({ el, App, props }) {
		const root = createRoot(el)

		root.render(
			<>
				<Toaster richColors expand duration={3000} position="top-right" />
				<App {...props} />
			</>
		)
	},
	progress: {
		color: "#4B5563",
	},
})
