// @ts-nocheck
import { Backend_URL } from "@/lib/constant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ErrorDisplay from "@/components/ErrorDisplay";
import AdminDashboardComponent from "@/components/AdminDashboard";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    try {
        // Fetch user data for display purposes
        // Authentication and role checks are handled by middleware
        const userResponse = await fetch(Backend_URL + `/user/${session?.user.id}`, {
            method: "GET",
            headers: {
                "authorization": `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await userResponse.json();

        return (
            <div className="min-h-screen pt-10 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Admin Header */}
                    <div className="bg-white rounded-sm shadow-sm p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                                <p className="text-gray-600 mt-1">Manage events and platform content</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Welcome back,</p>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-800 font-semibold">{user.name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <AdminDashboardComponent />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Admin Dashboard error:', error);
        return (
            <ErrorDisplay
                title="Error Loading Admin Dashboard"
                message="Unable to load admin dashboard. Please try again later."
                variant="error"
                showRetry={true}
                showHomeButton={true}
            />
        );
    }
}