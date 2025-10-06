import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createSpace } from "../services/api";
import toast from "react-hot-toast";
import type { CreateSpaceFormData } from "../types";

const CreateSpacePage = () => {
    const { register, handleSubmit } = useForm<CreateSpaceFormData>();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('address', data.address);
            formData.append('price_per_day', data.price_per_day.toString());
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }
            
            const newSpace = await createSpace(formData);
            toast.success("Space created successfully");
            navigate(`/spaces/${newSpace.id}`);
        } catch (error) {
            toast.error("Failed to Create Space");
            console.error(error);
        }
    };
    return (
        <div className="container mx-auto max-w-2xl px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Space</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" {...register('name')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input id="address" type="text" {...register('address')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" {...register('description')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="price_per_day">Price per Day (₹)</label>
                    <input id="price_per_day" type="number" {...register('price_per_day')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input
                        id="image"
                        type="file"
                        {...register('image')}
                        className="w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Space</button>
            </form>
        </div>
    )
}

export default CreateSpacePage;