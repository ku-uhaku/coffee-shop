import { Dialog } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const socialMediaSchema = z.object({
    platform: z.string().min(1, 'Platform name is required'),
    url: z.string().url('Invalid URL').min(1, 'URL is required'),

});

export default function SocialMediaModal({ isOpen, onClose, onAdd }) {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(socialMediaSchema),
        defaultValues: {
            platform: '',
            url: '',
        },
    });

    const onSubmit = (data) => {
        router.post(route('admin.store.updateSocialMedia'), {
            socialMedia: JSON.stringify(data)
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAdd(data);
                onClose();
                reset();
            },
            onError: (errors) => {
                console.error('Failed to add social media:', errors);
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
                    <Dialog.Title className="text-lg font-medium mb-4">Add Social Media</Dialog.Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="platform" value="Platform Name" />
                            <Controller
                                name="platform"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        id="platform"
                                        type="text"
                                        {...field}
                                        className="mt-1 block w-full"
                                    />
                                )}
                            />
                            {errors.platform && (
                                <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
                            )}
                        </div>
                        <div>
                            <InputLabel htmlFor="url" value="URL" />
                            <Controller
                                name="url"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        id="url"
                                        type="url"
                                        {...field}
                                        
                                        className="mt-1 block w-full"
                                    />
                                )}
                            />
                            {errors.url && (
                                <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
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
                                Add Social Media
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
