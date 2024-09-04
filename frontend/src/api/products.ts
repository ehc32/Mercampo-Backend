import { Product } from "../Interfaces";
import { authAxios, axi } from "./useAxios";


export const cate_api = async (category: string) => {
    const response = await authAxios.get(`/products/cate/${category}/`)
    return response.data.data.map((item) => item);
};

export const cate_api_random = async (category: string) => {
    const response = await authAxios.get(`/products/caterandom/${category}/`)
    return response.data
};


export const search_prod = async (query: string) => {
    const response = await authAxios.get(`/products/search/?query=${query}`)
    return response.data;
};

export const get_solo = async (slug: string) => {
    const response = await authAxios.get(`/products/get/${slug}/`)
    return response.data
};

export const get_solo_prod = async (id: number) => {
    const response = await authAxios.get(`/products/get/admin/${id}/`)
    return response.data
};

export const edit_product = async (data: Product) => {
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("count_in_stock", data.count_in_stock.toString())
    formData.append("category", data.category)
    formData.append("price", data.price.toString())
    if (data.image) {
        formData.append("image", data.image)
    }
    await authAxios.put(`/products/edit/${data.id}/`, formData)
};

export const delete_product = async (id: number) => {
    await authAxios.delete(`/products/delete/${id}/`)
};

export const post_product = async (data: Product) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("count_in_stock", data.count_in_stock.toString());
    formData.append("category", data.category);
    formData.append("price", data.price.toString());
    formData.append("unit", data.unit);
    formData.append("map_locate", data.map_locate);
    formData.append("locate", data.locate);
    if (data.image) {
        formData.append("images ", data.image);
    }
    await authAxios.post("/products/post/", formData);
};

export const filter_request = async (locate, price, categories, time, startDate, endDate, searchItem, pageParam) => {
    const urlParams = new URLSearchParams();

    if (locate) {
        urlParams.append("locate", locate);
    }
    if (price) {
        urlParams.append("price", price);
    }
    if (categories) {
        urlParams.append("categories", categories.join(","));
    }

    if (time) {
        urlParams.append("time", time);
    } else {
        urlParams.append("time", "manual");
        if (startDate && endDate) {
            urlParams.append("startDate", startDate.toISOString());
            urlParams.append("endDate", endDate.toISOString());
        }
    }
    if (searchItem) {
        urlParams.append("searchItem", searchItem);
    }

    const response = await axi.get(`/products/filterdata/?${urlParams.toString()}&page=${pageParam}&pages=20`);
    return response;
};

export const get_products = async ({ pageParam = 1 }) => {
    const response = await axi.get(`/products/?page=${pageParam}&pages=20`)
    return response.data
};

export const get_all_products = async () => {
    const response = await axi.get(`/products/getRandom/random_products/`)
    return response.data
};

export const get_all_images_product = async (id: number | string) => {
    const response = await axi.get(`/products/get_product_images/${id}/`)
    return response.data
};

export const get_all_products_paginated = async (page: number | string) => {
    const reponse = await axi.get(`/products/?page=${page}&page_size=10`)
    return reponse.data
}

export const get_all_products_paginated_to_shop = async (page: number | string) => {
    const reponse = await axi.get(`/products/?page=${page}&page_size=20`)
    return reponse.data
}

export const send_review = async (data: { userId: number, rating: number, opinion: string }, productId: number) => {
    const formData = new FormData();
    formData.append("user", data.userId.toString());
    formData.append("rating", data.rating.toString());
    formData.append("comment", data.opinion);
    await authAxios.post(`/products/opinion/send/${productId}/`, formData);
};

export const bring_reviews = async (productId: number) => {
    const response = await authAxios.get(`/products/opinion/bring/${productId}/`);
    return response
};
