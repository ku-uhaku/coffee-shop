import { Dialog } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const gstSchema = z.object({
    name: z.string().min(1, 'GST Name is required'),
    number: z.string().min(1, 'GST Number is required'),
    showInInvoice: z.boolean().optional()
});

export default function GstNumberModal({ isOpen, onClose, onAdd }) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(gstSchema),
    });

    const onSubmit = (data) => {
        router.post(route('admin.store.updateGstInfo'), {
            gstInfo: JSON.stringify(data)
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAdd(data);
                onClose();
                reset();
            },
            onError: (errors) => {
                console.error('Failed to add GST number:', errors);
            }
        });
    };

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
                    <Dialog.Title className="text-lg font-medium mb-4">Add GST Number</Dialog.Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="GST Name" />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        id="name"
                                        type="text"
                                        {...field}
                                        className="mt-1 block w-full"
                                    />
                                )}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <InputLabel htmlFor="number" value="GST Number" />
                            <Controller
                                name="number"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        id="number"
                                        type="text"
                                        {...field}
                                        className="mt-1 block w-full"
                                    />
                                )}
                            />
                            {errors.number && (
                                <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                            )}
                        </div>
                        <div>
                            <Controller
                                name="showInInvoice"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            {...field}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="ml-2 text-gray-700">Show in Invoice</span>
                                    </label>
                                )}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                            >
                                Add GST
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
