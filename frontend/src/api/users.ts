import { User } from "../Interfaces";
import { authAxios, axi } from "./useAxios";

export const get_solo_user = async (id: number) => {
    const response = await authAxios.get(`/users/get/solo/${id}/`)
    return response.data
};

export const edit_user = async (data: Partial<User>, id: number) => {
    console.log(data)
    const formData = new FormData();
    
    if (data.name) {
        formData.append("name", data.name);
    }
    if (data.phone) {
        formData.append("phone", data.phone);
    }
    if (data.email) {
        formData.append("email", data.email);
    }
    if (data.password) {
        formData.append("password", data.password);
    }
    if (data.avatar) {
        formData.append("avatar", data.avatar);
    }
    if (data.role) {
        formData.append("role", data.role);
    }
    console.log(formData)
    
    await authAxios.put(`/users/edit/${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};


export const search_users = async (query: string) => {
    const response = await authAxios.get(`/users/search/?query=${query}`)
    return response.data
};

export const delete_user = async (id: number) => {
    await authAxios.delete(`/users/delete/${id}/`)
};

export const get_users = async (page?: number) => {
    const response = await authAxios.get(`/users/get/?page=${page}`)
    return response.data
};

export const registerRequest = async (email: string, name: string, phone: string, password: string, wantBeSeller: boolean) => {
    await axi.post("/users/register/", { email, name, phone, password, wantBeSeller })
};

export const loginRequest = async (email: string, password: string) => {
    const response = await axi.post("/users/login/", { email, password })
    return response;
};

export const sendRequestSeller = async (idUser: number | string) => {
    await axi.post(`/users/sell/send_request/${idUser}/`)
};

export const bringRequestSeller = async () => {
    const response = await axi.get(`/users/sell/bring_request/`)
    return response;
};

export const approveRequestSeller = async (idUser: number | string) => {
    await axi.post(`/users/sell/approve_request/${idUser}/`);
};

export const changePermission = async (idUser: number | string) => {
    await axi.post(`/users/sell/changePermision/${idUser}/`);
};

export const deleteRequestSeller = async (idUser: number | string) => {
    await axi.delete(`/users/sell/delete_request/${idUser}/`);
};

export const sendRequestSellerPayPalConfig = async (idUser: number | string, formData: FormData) => {
    await axi.post(`/users/sell/paypalsel/${idUser}/`, formData);
};

export const get_paypal_user = async (id: number) => {
    const response = await axi.get(`/users/paypalconfig/3/`);
    return response;
};

export const sendEnterpriseRequest = async (idUser: number | string, formData: FormData) => {
    await axi.post(`/users/create-enterprise/${idUser}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const get_enterprices = async (
    page: number,
    filters?: {
      searchQuery?: string;
    }
  ) => {
    const params: any = { page };
    
    if (filters?.searchQuery) {
      params.search = filters.searchQuery;
    }
  
    const response = await authAxios.get(`users/get-enterprises/`, { params });
    return response.data;
  };

export const getEnterpriseByUser = async (userId: number | string) => {
    const response = await axi.get(`users/get-enterprise-by-user/${userId}`);
    return response; 
};

export const create_post = async (data: {
    enterprise: number;
    title: string;
    description: string;
    images?: string[]; 
    redirect_link?: string;
}) => {
    const response = await authAxios.post("/users/posts/create/", data);
    return response.data;
};

export const update_post = async (post_id: number, data: any) => {
    const postData = {
      ...data,
      ...(data.images !== undefined && { images: data.images })
    };
  
    const response = await authAxios.patch(
      `/users/posts/${post_id}/`,
      postData
    );
    return response.data;
  };
  
  export const delete_post = async (post_id: number) => {
    await authAxios.delete(`/users/posts/${post_id}/`);
  };

export const create_comment = async (post_id: number, data: {
    comment: string;
    rating?: number;
}) => {
    const response = await authAxios.post(
        `/users/posts/${post_id}/comments/create/`, 
        data
    );
    return response.data;
};

export const get_enterprise_posts = async (enterprise_id: number, page?: number) => {
    const url = `/users/enterprises/${enterprise_id}/posts/`;
    const params = page ? { page } : {};
    const response = await authAxios.get(url, { params });
    return response.data;
};

export const get_all_enterprise_posts = async (
    page?: number,
    filters?: {
        orderByDate?: 'asc' | 'desc',
        orderByComments?: 'asc' | 'desc',
        searchQuery?: string
    }
) => {
    const url = `/users/posts/all/`;
    
    // Construir objeto de parámetros
    const params: any = {};
    
    if (page) params.page = page;
    if (filters) {
        if (filters.orderByDate) params.order_by_date = filters.orderByDate;
        if (filters.orderByComments) params.order_by_comments = filters.orderByComments;
        if (filters.searchQuery) params.search = filters.searchQuery;
    }
    
    const response = await authAxios.get(url, { params });
    return response.data;
};

export const get_single_post = async (post_id: number) => {
    const response = await authAxios.get(`/users/posts/${post_id}/`);
    return response.data;
};

// Funciones adicionales útiles
export const get_user_posts = async (user_id: number) => {
    const response = await authAxios.get(`/users/posts/user/${user_id}/`);
    return response.data;
};

export const edit_comment = async (
    comment_id: number, 
    data: {
      comment?: string;
      rating?: number;
    }
  ) => {
    const response = await authAxios.patch(
      `/users/comments/${comment_id}/`, 
      data
    );
    return response.data;
  };
  
  // Eliminar un comentario (marcar como inactivo)
  export const delete_comment = async (comment_id: number) => {
    await authAxios.delete(`/users/comments/${comment_id}/`);
  };