import BtnLoading from "@/Components/BtnLoading"
import ImageDrop from "@/Components/ImageDrop"
import InputLabel from "@/Components/InputLabel"
import ServerErrors from "@/Components/ServerErrors"
import { Tab, Tabs } from "@/Components/Tabs"
import TextInput from "@/Components/TextInput"
import Select from "@/Components/Select"  // Add this import
import AdminLayout from "@/Layouts/AdminLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { Head, router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import moment from "moment-timezone"
import GstNumberModal from "./gstNumberModal"
import Modal from "@/Components/Modal"
import { TrashIcon } from '@heroicons/react/24/outline'



const storeSchema = z
	.object({
		name: z.string().min(1, "Store name is required"),
		slug: z.string().min(1, "Slug is required"),
		description: z.string().min(1, "Description is required"),
		image: z.instanceof(File).optional(),
		status: z.enum(["active", "inactive"]),
		type: z.string().min(1, "Store type is required"),
		address: z.string().min(1, "Address is required"),
		city: z.string().min(1, "City is required"),
		country: z.string().min(1, "Country is required"),
		zip: z.string().min(1, "ZIP code is required"),
		phone: z.string().optional().nullable(),
		mobile: z.string().optional().nullable(),
		email: z.string().email("Invalid email address"),
		website: z.string().url("Invalid website URL").optional().nullable(),
		social_media: z.record(z.string().url("Invalid URL")).optional().nullable(),
		time_zone: z.string().optional().nullable(),
		currency: z.string().min(1, "Currency is required"),
		currency_symbol: z.string().min(1, "Currency symbol is required"),
		currency_placement: z.enum(["before", "after"]).default("before"),
		thousand_separator: z.string().max(1).default(","),
		decimal_separator: z.string().max(1).default("."),
		date_format: z.string().default("YYYY-MM-DD"),
		time_format: z.string().default("HH:mm:ss"),
		no_of_decimals: z.number().int().min(0).max(4).default(2),
		gsts_numbers: z.array(z.string()).optional().nullable(),
	})

	

export default function Store({ store, gstNumbers }) {
	const { errors: serverErrors } = usePage().props
	const [activeTab, setActiveTab] = useState(0)
	const [isGstModalOpen, setIsGstModalOpen] = useState(false)
	const [gstList, setGstList] = useState(gstNumbers || [])
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [deleteIndex, setDeleteIndex] = useState(null)

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm({
		resolver: zodResolver(storeSchema),
		defaultValues: {
			name: store?.name ?? '',
			slug: store?.slug ?? '',
			description: store?.description ?? '',
			status: store?.status ?? 'active',
			type: store?.type ?? '',
			address: store?.address ?? '',
			city: store?.city ?? '',
			country: store?.country ?? '',
			zip: store?.zip ?? '',
			phone: store?.phone ?? '',
			mobile: store?.mobile ?? '',
			email: store?.email ?? '',
			website: store?.website ?? '',
			social_media: store?.social_media ?? {},
			time_zone: store?.time_zone ?? '',
			currency: store?.currency ?? '',
			currency_symbol: store?.currency_symbol ?? '',
			currency_placement: store?.currency_placement ?? 'before',
			thousand_separator: store?.thousand_separator ?? ',',
			decimal_separator: store?.decimal_separator ?? '.',
			date_format: store?.date_format ?? 'YYYY-MM-DD',
			time_format: store?.time_format ?? 'HH:mm:ss',
			no_of_decimals: store?.no_of_decimals ?? 2,
		},
	})
    

	const handleImageChange = (file) => {
		setValue("image", file)
	}
    
    const timeZones = moment.tz.names();

	const handleAddGst = (newGst) => {
		setGstList([...gstList, newGst])
	}

	const handleUpdateGst = (index, field, value) => {
		const updatedList = [...gstList]
		updatedList[index] = { ...updatedList[index], [field]: value }
		setGstList(updatedList)
	}

	const handleDeleteGst = (index) => {
        setDeleteIndex(index)
        setDeleteModalOpen(true)
	}

	const confirmDelete = () => {
		if (deleteIndex !== null) {
			const updatedList = gstList.filter((_, i) => i !== deleteIndex)
			setGstList(updatedList)
			setDeleteModalOpen(false)
			setDeleteIndex(null)
		}
	}

	useEffect(() => {
		setValue('gsts_numbers', gstList)
	}, [gstList, setValue])

	const onSubmit = async (data) => {
		try {
			const formData = new FormData()
			for (const key in data) {
				if (key === "image" && data[key]) {
					formData.append("image", data[key])
				} else if (key === "social_media" || key === "gsts_numbers") {
					formData.append(key, JSON.stringify(data[key]))
				} else {
					formData.append(key, data[key])
				}
			}

			router.post(route("admin.store.update"), formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<AdminLayout header="Store">
			<Head title="Store" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<ServerErrors errors={serverErrors} />
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
						<div className="p-6 text-gray-900">
							<h2 className="mb-4 text-2xl font-semibold">Create Store</h2>

							<form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
								<div className="w-1/3 pr-4">
									<div className="mb-4">
										<ImageDrop onImageChange={handleImageChange} />
									</div>
								</div>

								<div className="w-2/3 pl-4">
									<Tabs activeTab={activeTab} onTabChange={setActiveTab}>
										<Tab label="Store Information">
											<div className="space-y-6">
												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="name" value="Store Name" />
														<Controller
															name="name"
															control={control}
															rules={{ required: "Store name is required" }}
															render={({ field }) => (
																<TextInput
																	id="name"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="email" value="Email" />
														<Controller
															name="email"
															control={control}
															rules={{
																required: "Email is required",
																pattern: {
																	value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
																	message: "Invalid email address",
																},
															}}
															render={({ field }) => (
																<TextInput
																	id="email"
																	type="email"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
													</div>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="phone" value="Phone Number" />
														<Controller
															name="phone"
															control={control}
															rules={{
																required: "Phone number is required",
																pattern: {
																	value: /^[0-9]{10}$/,
																	message: "Invalid phone number",
																},
															}}
															render={({ field }) => (
																<TextInput
																	id="phone"
																	type="tel"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="mobile" value="Mobile Number" />
														<Controller
															name="mobile"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="mobile"
																	type="tel"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
													</div>
												</div>

												<div>
													<InputLabel htmlFor="website" value="Website" />
													<Controller
														name="website"
														control={control}
														render={({ field }) => (
															<TextInput
																id="website"
																type="url"
																className="mt-1 block w-full"
																{...field}
															/>
														)}
													/>
													{errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
												</div>
												<div>
													<InputLabel htmlFor="address" value="Address" />
													<Controller
														name="address"
														control={control}
														rules={{
															required: "Address is required",
														}}
														render={({ field }) => (
															<TextInput
																id="address"
																type="text"
																className="mt-1 block w-full"
																{...field}
															/>
														)}
													/>
													{errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
												</div>

												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="city" value="City" />
														<Controller
															name="city"
															control={control}
															rules={{
																required: "City is required",
															}}
															render={({ field }) => (
																<TextInput
																	id="city"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="country" value="Country" />
														<Controller
															name="country"
															control={control}
															rules={{
																required: "Country is required",
															}}
															render={({ field }) => (
																<TextInput
																	id="country"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
													</div>
												</div>

												<div>
													<InputLabel htmlFor="zip" value="ZIP Code" />
													<Controller
														name="zip"
														control={control}
														rules={{
															required: "ZIP code is required",
														}}
														render={({ field }) => (
															<TextInput
																id="zip"
																type="text"
																className="mt-1 block w-full"
																{...field}
															/>
														)}
													/>
													{errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>}
												</div>

												<div>
													<InputLabel htmlFor="description" value="Description" />
													<Controller
														name="description"
														control={control}
														render={({ field }) => (
															<textarea
																id="description"
																rows="4"
																className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
																{...field}
															></textarea>
														)}
													/>
													{errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
												</div>
											</div>
										</Tab>

                                        <Tab label="Social Media">
                                            
                                        </Tab>

										<Tab label="Settings">
											<div className="space-y-6">
												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="time_zone" value="Time Zone" />
														<Controller
															name="time_zone"
															control={control}
															render={({ field }) => (
																<Select id="time_zone" className="mt-1 block w-full" {...field}>
																	<option value="">Select Time Zone</option>
																	{timeZones.map((zone) => (
																		<option key={zone} value={zone}>
																			{zone}
																		</option>
																	))}
																</Select>
															)}
														/>
														{errors.time_zone && <p className="mt-1 text-sm text-red-600">{errors.time_zone.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="currency" value="Currency" />
														<Controller
															name="currency"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="currency"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
													</div>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="currency_symbol" value="Currency Symbol" />
														<Controller
															name="currency_symbol"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="currency_symbol"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.currency_symbol && <p className="mt-1 text-sm text-red-600">{errors.currency_symbol.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="currency_placement" value="Currency Placement" />
														<Controller
															name="currency_placement"
															control={control}
															render={({ field }) => (
																<Select id="currency_placement" className="mt-1 block w-full" {...field}>
																	<option value="">Select Currency Placement</option>
																	<option value="before">Before</option>
																	<option value="after">After</option>
																</Select>
															)}
														/>
														{errors.currency_placement && <p className="mt-1 text-sm text-red-600">{errors.currency_placement.message}</p>}
													</div>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="thousand_separator" value="Thousand Separator" />
														<Controller
															name="thousand_separator"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="thousand_separator"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.thousand_separator && <p className="mt-1 text-sm text-red-600">{errors.thousand_separator.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="decimal_separator" value="Decimal Separator" />
														<Controller
															name="decimal_separator"
															control={control}
															render={({ field }) => (
																<TextInput
																	id="decimal_separator"
																	type="text"
																	className="mt-1 block w-full"
																	{...field}
																/>
															)}
														/>
														{errors.decimal_separator && <p className="mt-1 text-sm text-red-600">{errors.decimal_separator.message}</p>}
													</div>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<div>
														<InputLabel htmlFor="date_format" value="Date Format" />
														<Controller
															name="date_format"
															control={control}
															render={({ field }) => (
																<Select id="date_format" className="mt-1 block w-full" {...field}>
																	<option value="">Select Date Format</option>
																	<option value="YYYY-MM-DD">YYYY-MM-DD</option>
																	<option value="DD-MM-YYYY">DD-MM-YYYY</option>
																	<option value="MM-DD-YYYY">MM-DD-YYYY</option>
																</Select>
															)}
														/>
														{errors.date_format && <p className="mt-1 text-sm text-red-600">{errors.date_format.message}</p>}
													</div>
													<div>
														<InputLabel htmlFor="time_format" value="Time Format" />
														<Controller
															name="time_format"
															control={control}
															render={({ field }) => (
																<Select id="time_format" className="mt-1 block w-full" {...field}>
																	<option value="">Select Time Format</option>
																	<option value="HH:mm:ss">24-hour format (e.g., 14:30:00)</option>
																	<option value="hh:mm:ss A">12-hour format (e.g., 02:30:00 PM)</option>
																</Select>
															)}
														/>
														{errors.time_format && <p className="mt-1 text-sm text-red-600">{errors.time_format.message}</p>}
													</div>
												</div>

												<div>
													<InputLabel htmlFor="no_of_decimals" value="Number of Decimals" />
													<Controller
														name="no_of_decimals"
														control={control}
														render={({ field }) => (
															<TextInput
																id="no_of_decimals"
																type="number"
																min="0"
																max="4"
																className="mt-1 block w-full"
																{...field}
															/>
														)}
													/>
													{errors.no_of_decimals && <p className="mt-1 text-sm text-red-600">{errors.no_of_decimals.message}</p>}
												</div>
											</div>
										</Tab>

                                        <Tab label="GST Information">
											<div className="space-y-6">
												<div className="flex justify-between items-center">
													<h3 className="text-lg font-semibold">GST Numbers</h3>
													<button
														type="button"
														onClick={() => setIsGstModalOpen(true)}
														className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
													>
														Add GST Number
													</button>
												</div>
												<div className="space-y-4">
													<Controller
														name="gsts_numbers"
														control={control}
														render={({ field }) => (
															<>
																{field.value.map((gst, index) => (
																	<div key={index} className="flex items-center space-x-4">
																		<div className="flex-1">
																			<InputLabel htmlFor={`gst-name-${index}`} value={gst.name} />
																			<TextInput
																				id={`gst-name-${index}`}
																				type="text"
																				value={gst.number}
																				onChange={(e) => {
																					const updatedGsts = [...field.value];
																					updatedGsts[index].number = e.target.value;
																					field.onChange(updatedGsts);
																				}}
																				className="mt-1 block w-full"
																			/>
																		</div>
																		<div className="flex items-center">
																			<input
																				type="checkbox"
																				id={`gst-show-${index}`}
																				checked={gst.showInInvoice}
																				onChange={(e) => {
																					const updatedGsts = [...field.value];
																					updatedGsts[index].showInInvoice = e.target.checked;
																					field.onChange(updatedGsts);
																				}}
																				className="form-checkbox h-5 w-5 text-blue-600"
																			/>
																			<label htmlFor={`gst-show-${index}`} className="ml-2 text-sm text-gray-700">
																				Show in Invoice
																			</label>
																		</div>
																		<button
																			type="button"
																			onClick={() => {
																				const updatedGsts = field.value.filter((_, i) => i !== index);
																				field.onChange(updatedGsts);
																			}}
																			className="p-1 text-red-500 hover:text-red-700 transition duration-300"
																		>
																			<TrashIcon className="h-5 w-5" />
																		</button>
																	</div>
																))}
															</>
														)}
													/>
												</div>
											</div>
										</Tab>
									</Tabs>

									<div className="mt-4">
										<BtnLoading
											type="submit"
											className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
											loading={isSubmitting}
										>
											Update Store
										</BtnLoading>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			<GstNumberModal
				isOpen={isGstModalOpen}
				onClose={() => setIsGstModalOpen(false)}
				onAdd={handleAddGst}
			/>

			<Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
				<div className="p-6">
					<h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
					<p className="mt-2 text-sm text-gray-500">
						Are you sure you want to delete this GST number? This action cannot be undone.
					</p>
					<div className="mt-4 flex justify-end space-x-3">
						<button
							type="button"
							className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
							onClick={confirmDelete}
						>
							Delete
						</button>
						<button
							type="button"
							className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
							onClick={() => setDeleteModalOpen(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			</Modal>
		</AdminLayout>
	)
}