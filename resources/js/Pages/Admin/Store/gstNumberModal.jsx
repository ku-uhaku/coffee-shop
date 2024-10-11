import { Dialog } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const gstSchema = z.object({
    name: z.string().min(1, 'GST Name is required'),
    number: z.string().length(15, 'GST Number must be exactly 15 characters')
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number format'),
});

export default function GstNumberModal({ isOpen, onClose, onAdd }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(gstSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(route('admin.store.updateGstInfo'), {
                gstsNumbers: [data]
            });
            if (response.data.success) {
                onAdd(data);
                onClose();
                reset();
            } else {
                console.error('Failed to add GST number');
            }
        } catch (error) {
            console.error('Error adding GST number:', error);
        }
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
                            <TextInput
                                id="name"
                                type="text"
                                {...register('name')}
                                className="mt-1 block w-full"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <InputLabel htmlFor="number" value="GST Number" />
                            <TextInput
                                id="number"
                                type="text"
                                {...register('number')}
                                className="mt-1 block w-full"
                            />
                            {errors.number && (
                                <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                            )}
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
