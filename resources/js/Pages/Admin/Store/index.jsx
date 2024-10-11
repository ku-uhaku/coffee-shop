import BtnLoading from "@/Components/BtnLoading";
import ImageDrop from "@/Components/ImageDrop";
import InputLabel from "@/Components/InputLabel";
import ServerErrors from "@/Components/ServerErrors";
import { Tab, Tabs } from "@/Components/Tabs";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import SocialMediaModal from "./socialMediaModal";
import moment from "moment-timezone";
import GstNumberModal from "./gstNumberModal";
const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    image: z.instanceof(File).optional(),
    status: z.enum(["active", "inactive"]).default("active"),
    type: z.enum(["physical", "digital"]).default("physical"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    zip: z.string().min(1, "Zip is required"),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().email("Invalid email"),
    website: z.string().optional(),
    social_media: z
        .array(
            z.object({
                platform: z.string(),
                url: z.string(),
            })
        )
        .optional(),
    time_zone: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    currency_symbol: z.string().min(1, "Currency symbol is required"),
    currency_placement: z.enum(["before", "after"]).default("before"),
    thousand_separator: z.enum([",", "."]).default(","),
    date_format: z.string().default("d-m-Y"),
    time_format: z.string().default("H:i:s"),
    decimal_separator: z.enum([",", "."]).default("."),
    no_of_decimals: z.number().default(2),
    gst_number: z
        .array(
            z.object({
                type: z.string(),
                value: z.string(),
            })
        )
        .optional(),
 
});

export default function CreateStore({ store }) {
    const { errors: serverErrors } = usePage().props;
    const [activeTab, setActiveTab] = useState(0);
    const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
    const [existingSocialMedia, setExistingSocialMedia] = useState([]);
   
    const [isGstNumberModalOpen, setIsGstNumberModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            image: null,
            status: "active",
            type: "physical",
            address: "",
            city: "",
            country: "",
            zip: "",
            phone: "",
            mobile: "",
            email: "",
            website: "",
            social_media: [],
            time_zone: "",
            currency: "",
            currency_symbol: "",
            currency_placement: "before",
            thousand_separator: ",",
            date_format: "d-m-Y",
            time_format: "H:i:s",
            decimal_separator: ".",
            no_of_decimals: 2,
            gst_number: [],
            documents: [],
        },
    });

    const socialMedia = watch("social_media");

    const handleImageChange = (file) => {
        setValue("image", file);
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (key === "image" && data[key]) {
                    formData.append("image", data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }

            router.post(route("admin.store.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenSocialMediaModal = () => {
        setIsSocialMediaModalOpen(true);
    };

    const handleCloseSocialMediaModal = () => {
        setIsSocialMediaModalOpen(false);
    };

    const handleAddSocialMedia = (newSocialMedia) => {
        setValue("social_media", [...socialMedia, ...newSocialMedia]);
        setIsSocialMediaModalOpen(false);
    };

    const handleOpenGstNumberModal = () => {
        setIsGstNumberModalOpen(true);
    };

    const handleCloseGstNumberModal = () => {
        setIsGstNumberModalOpen(false);
    };

    const handleAddGstNumber = (newGstNumber) => {
        setValue("gst_number", [...watch("gst_number"), newGstNumber]);
        setIsGstNumberModalOpen(false);
    };

    const timeZones = moment.tz.names();

    return (
        <AdminLayout header="Store">
            <Head title="Store" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <ServerErrors errors={serverErrors} />
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="mb-4 text-2xl font-semibold">
                                Store
                            </h2>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex w-full"
                            >
                                <div className="w-1/3 pr-4">
                                    <div className="mb-4">
                                        <ImageDrop
                                            onImageChange={handleImageChange}
                                        />
                                    </div>
                                </div>

                                <div className="w-2/3 pl-4">
                                    <Tabs
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                    >
                                        <Tab label="Store Information">
                                            <div className="space-y-4">
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="name"
                                                            value="Name"
                                                            required
                                                        />
                                                        <Controller
                                                            name="name"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="name"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Name"
                                                                />
                                                            )}
                                                        />
                                                        {errors.name && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors.name
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="slug"
                                                            value="Slug"
                                                            required
                                                        />
                                                        <Controller
                                                            name="slug"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="slug"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Slug"
                                                                />
                                                            )}
                                                        />
                                                        {errors.slug && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors.slug
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="description"
                                                            value="Description"
                                                            required
                                                        />
                                                        <Controller
                                                            name="description"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="description"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Description"
                                                                />
                                                            )}
                                                        />
                                                        {errors.description && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors
                                                                        .description
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="address"
                                                            value="Address"
                                                            required
                                                        />
                                                        <Controller
                                                            name="address"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="address"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Address"
                                                                />
                                                            )}
                                                        />
                                                        {errors.address && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors
                                                                        .address
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="city"
                                                            value="City"
                                                            required
                                                        />
                                                        <Controller
                                                            name="city"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="city"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="City"
                                                                />
                                                            )}
                                                        />
                                                        {errors.city && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors.city
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="country"
                                                            value="Country"
                                                            required
                                                        />
                                                        <Controller
                                                            name="country"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="country"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Country"
                                                                />
                                                            )}
                                                        />
                                                        {errors.country && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors
                                                                        .country
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="zip"
                                                            value="ZIP"
                                                            required
                                                        />
                                                        <Controller
                                                            name="zip"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="zip"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="ZIP"
                                                                />
                                                            )}
                                                        />
                                                        {errors.zip && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors.zip
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>

                                        <Tab label="Social Media">
                                            <div className="space-y-4">
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="phone"
                                                            value="Phone"
                                                        />
                                                        <Controller
                                                            name="phone"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="phone"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Phone"
                                                                />
                                                            )}
                                                        />
                                                        {errors.phone && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors.phone
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="mobile"
                                                            value="Mobile"
                                                        />
                                                        <Controller
                                                            name="mobile"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="mobile"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Mobile"
                                                                />
                                                            )}
                                                        />
                                                        {errors.mobile && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors
                                                                        .mobile
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="email"
                                                            value="Email"
                                                            required
                                                        />
                                                        <Controller
                                                            name="email"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
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
                                                            <p className="text-red-500">
                                                                {
                                                                    errors.email
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="website"
                                                            value="Website"
                                                        />
                                                        <Controller
                                                            name="website"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <TextInput
                                                                    id="website"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Website"
                                                                />
                                                            )}
                                                        />
                                                        {errors.website && (
                                                            <p className="text-red-500">
                                                                {
                                                                    errors
                                                                        .website
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-8 bg-gray-50 shadow-xl rounded-lg p-6">
                                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                                        Social Media Links
                                                    </h3>
                                                  

                                                    <div className="mt-6 flex justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={handleOpenSocialMediaModal}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                            </svg>
                                                            Add Social Media Link
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab label="Store Settings">
                                            <div className="space-y-4">
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="time_zone"
                                                            value="Time Zone"
                                                        />
                                                        <Controller
                                                            name="time_zone"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <select
                                                                    id="time_zone"
                                                                    {...field}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                                >
                                                                    <option value="">Select a time zone</option>
                                                                    {timeZones.map((zone) => (
                                                                        <option key={zone} value={zone}>
                                                                            {zone}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                        />
                                                        {errors.time_zone && (
                                                            <p className="text-red-500">
                                                                {errors.time_zone.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="currency"
                                                            value="Currency"
                                                            required
                                                        />
                                                        <Controller
                                                            name="currency"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    id="currency"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Currency"
                                                                />
                                                            )}
                                                        />
                                                        {errors.currency && (
                                                            <p className="text-red-500">
                                                                {errors.currency.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="currency_symbol"
                                                            value="Currency Symbol"
                                                            required
                                                        />
                                                        <Controller
                                                            name="currency_symbol"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    id="currency_symbol"
                                                                    {...field}
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Currency Symbol"
                                                                />
                                                            )}
                                                        />
                                                        {errors.currency_symbol && (
                                                            <p className="text-red-500">
                                                                {errors.currency_symbol.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="currency_placement"
                                                            value="Currency Placement"
                                                        />
                                                        <Controller
                                                            name="currency_placement"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <select
                                                                    id="currency_placement"
                                                                    {...field}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value="before">Before</option>
                                                                    <option value="after">After</option>
                                                                </select>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="thousand_separator"
                                                            value="Thousand Separator"
                                                        />
                                                        <Controller
                                                            name="thousand_separator"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <select
                                                                    id="thousand_separator"
                                                                    {...field}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value=",">Comma (,)</option>
                                                                    <option value=".">Dot (.)</option>
                                                                    <option value=".">Space ( )</option>

                                                                </select>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="decimal_separator"
                                                            value="Decimal Separator"
                                                        />
                                                        <Controller
                                                            name="decimal_separator"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <select
                                                                    id="decimal_separator"
                                                                    {...field}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value=".">Dot (.)</option>
                                                                    <option value=",">Comma (,)</option>
                                                                 
                                                                </select>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="date_format"
                                                            value="Date Format"
                                                        />
                                                        <Controller
                                                            name="date_format"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <select
                                                                    id="date_format"
                                                                    {...field}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value="d-m-Y">DD-MM-YYYY</option>
                                                                    <option value="m-d-Y">MM-DD-YYYY</option>
                                                                    <option value="Y-m-d">YYYY-MM-DD</option>
                                                                </select>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="time_format"
                                                            value="Time Format"
                                                        />
                                                        <Controller
                                                            name="time_format"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <select
                                                                    id="time_format"
                                                                    {...field}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                >
                                                                    <option value="HH:mm:ss">24-hour (HH:MM:SS)</option>
                                                                    <option value="h:mm:ss a">12-hour (HH:MM:SS AM/PM)</option>
                                                                </select>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <InputLabel
                                                            htmlFor="no_of_decimals"
                                                            value="Number of Decimals"
                                                        />
                                                        <Controller
                                                            name="no_of_decimals"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <TextInput
                                                                    id="no_of_decimals"
                                                                    {...field}
                                                                    type="number"
                                                                    className="mt-1 block w-full"
                                                                    placeholder="Number of Decimals"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-8 bg-gray-50 shadow-xl rounded-lg p-6">
                                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                                        GST Numbers
                                                    </h3>
                                                    {watch("gst_number") && watch("gst_number").length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {watch("gst_number").map((gst, index) => (
                                                                <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
                                                                    <div className="flex-grow">
                                                                        <InputLabel
                                                                            htmlFor={`gst-${index}`}
                                                                            value={gst.name}
                                                                            className="text-sm font-medium text-gray-700"
                                                                        />
                                                                        <TextInput
                                                                            id={`gst-${index}`}
                                                                            value={gst.number}
                                                                            className="mt-1 block w-full bg-white border-gray-300"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">No GST numbers added yet.</p>
                                                    )}

                                                    <div className="mt-6 flex justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={handleOpenGstNumberModal}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                            </svg>
                                                            Add GST Number
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>

                                        <Tab label="Documents">
                                            <div className="space-y-4">
                                                <div className="mt-8 bg-gray-50 shadow-xl rounded-lg p-6">
                                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                                        Store Documents
                                                    </h3>
                                                    {store.documents && store.documents.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {store.documents.map((doc, index) => (
                                                                <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
                                                                    <div className="flex-grow">
                                                                        <InputLabel
                                                                            htmlFor={`document-${index}`}
                                                                            value={doc.name}
                                                                            className="text-sm font-medium text-gray-700"
                                                                        />
                                                                        <TextInput
                                                                            id={`document-${index}`}
                                                                            value={doc.file_name}
                                                                            className="mt-1 block w-full bg-white border-gray-300"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">No documents added yet.</p>
                                                    )}

                                                    <div className="mt-6 flex justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={handleOpenGstNumberModal}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                                            </svg>
                                                            Add Document
                                                        </button>
                                                    </div>
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
                                            Create Store
                                        </BtnLoading>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <SocialMediaModal
                isOpen={isSocialMediaModalOpen}
                onClose={handleCloseSocialMediaModal}
                onAdd={handleAddSocialMedia}
            />
            <GstNumberModal
                isOpen={isGstNumberModalOpen}
                onClose={handleCloseGstNumberModal}
                onAdd={handleAddGstNumber}
            />
        
        </AdminLayout>
    );
}