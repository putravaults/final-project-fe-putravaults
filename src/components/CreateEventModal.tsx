// @ts-nocheck
'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { eventApi } from '@/lib/api';
import { Event } from '@/lib/types';
import { IoClose } from 'react-icons/io5';

interface CreateEventModalProps {
    onClose: () => void;
    onEventCreated: (event: Event) => void;
}

interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
    thumbnailUrl: string;
    bannerUrl: string;
}

export default function CreateEventModal({ onClose, onEventCreated }: CreateEventModalProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<EventFormData>({
        name: '',
        description: '',
        date: '',
        location: '',
        thumbnailUrl: '',
        bannerUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.accessToken) {
            alert('You must be logged in to create events.');
            return;
        }

        // Validate form data
        if (!formData.name || !formData.description || !formData.date || !formData.location) {
            alert('Please fill in all required fields (Name, Description, Date, Location)');
            return;
        }

        setLoading(true);
        try {
            // Prepare event data according to backend DTO requirements
            const dateObj = new Date(formData.date);
            
            const eventData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                date: dateObj.toISOString(),
                location: formData.location.trim(),
                ...(formData.thumbnailUrl && formData.thumbnailUrl.trim() && { thumbnailUrl: formData.thumbnailUrl.trim() }),
                ...(formData.bannerUrl && formData.bannerUrl.trim() && { bannerUrl: formData.bannerUrl.trim() }),
            };

            const newEvent = await eventApi.createEvent(eventData, session.accessToken);
            console.log('Create response:', newEvent);
            
            onEventCreated(newEvent);
            onClose();
        } catch (error) {
            console.error('Failed to create event:', error);
            
            // More detailed error handling
            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    alert('Unauthorized: Please check your login status and admin permissions.');
                } else if (error.message.includes('403')) {
                    alert('Forbidden: You do not have permission to create events.');
                } else if (error.message.includes('400')) {
                    alert('Invalid data: Please check all required fields are filled correctly. Make sure the date is in the future.');
                } else {
                    alert(`Failed to create event: ${error.message}`);
                }
            } else {
                alert('Failed to create event. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Event</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
                    >
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter event name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date & Time *
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter event location"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter event description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail URL
                            </label>
                            <input
                                type="url"
                                name="thumbnailUrl"
                                value={formData.thumbnailUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://example.com/thumbnail.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner URL
                            </label>
                            <input
                                type="url"
                                name="bannerUrl"
                                value={formData.bannerUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-800 text-white rounded-sm hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
