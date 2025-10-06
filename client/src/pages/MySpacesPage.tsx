import { useState, useEffect } from "react";
import { deleteSpace, getMySpaces } from "../services/api";
import type { Space } from "../types";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MySpacesPage = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    useEffect(() => {
        const fetchMySpaces = async () => {
            try {
                const data = await getMySpaces();
                setSpaces(data);
            } catch (error) {
                console.error("Failed to fetch user's space ", error);
            }
        }
        fetchMySpaces();
    }, []);

    const handleDelete = async (spaceId: number) => {
        if (window.confirm('Are you sure you want to delete the space ? ')) {
            try {
                await deleteSpace(spaceId.toString());
                setSpaces(spaces.filter(space => space.id !== spaceId));
                toast.success('Space deleted successfully');
            } catch (err) {
                toast.error('Failed to delete space');
            }
        }
    }
    return (
        <div className="container mx-auto px-6 py-8">

            {spaces.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">You haven't created any spaces yet.</h2>
                    <p className="text-gray-500 mt-2">Click the button above to add your first space!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {spaces.map(space => (
                        <div
                            key={space.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300"
                        >
                            <div className="pl-4 mt-6 flex-grow">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{space.name}</h2>
                                <p className="text-gray-500 text-sm mb-4">{space.address}</p>
                                <p className="text-gray-500 text-sm mb-4">{space.description}</p>
                            </div>

                            <div className="px-6 pb-4 flex justify-between items-center border-t border-gray-100 pt-4">
                                <p className="text-lg font-bold text-gray-800">₹{space.price_per_day}</p>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/spaces/${space.id}/edit`}
                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-300"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(space.id)}
                                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySpacesPage;