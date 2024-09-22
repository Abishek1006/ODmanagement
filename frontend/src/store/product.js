import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),

	createProduct: async (newProduct) => {
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newProduct),
			});
			const data = await res.json();

			// Handle errors during product creation
			if (!data.success) return { success: false, message: data.message };

			// Add the new product to the store
			set((state) => ({ products: [...state.products, data.data] }));
			return { success: true, message: "Product created successfully" };
		} catch (error) {
			return { success: false, message: "Network error or server issue." };
		}
	},

	fetchProducts: async () => {
		try {
			const res = await fetch("/api/products");
			const data = await res.json();

			// Handle errors during fetching products
			if (!data.success) return { success: false, message: data.message };

			// Set the fetched products to the store
			set({ products: data.data });
		} catch (error) {
			return { success: false, message: "Unable to fetch products. Please try again later." };
		}
	},

	deleteProduct: async (pid) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "DELETE",
			});
			const data = await res.json();

			// Handle errors during product deletion
			if (!data.success) return { success: false, message: data.message };

			// Remove the deleted product from the store
			set((state) => ({
				products: state.products.filter((product) => product._id !== pid),
			}));
			return { success: true, message: data.message };
		} catch (error) {
			return { success: false, message: "Unable to delete product. Please try again later." };
		}
	},

	updateProduct: async (pid, updatedProduct) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedProduct),
			});
			const data = await res.json();

			// Handle errors during product update
			if (!data.success) return { success: false, message: data.message };

			// Update the product in the store
			set((state) => ({
				products: state.products.map((product) => (product._id === pid ? data.data : product)),
			}));

			return { success: true, message: data.message };
		} catch (error) {
			return { success: false, message: "Unable to update product. Please try again later." };
		}
	},
}));
