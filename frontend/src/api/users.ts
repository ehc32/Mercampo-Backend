import { User } from "../Interfaces";
import { authAxios, axi } from "./useAxios";

export const get_solo_user = async (id: number) => {
    const response = await authAxios.get(`/users/get/solo/${id}/`)
    return response.data
};

export const edit_user = async (data: User, id: number) => {
    console.log(data)
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("phone", data.phone)
    formData.append("email", data.email)
    formData.append("role", data.role)
    await authAxios.put(`/users/edit/${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
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

export const registerRequest = async (email: string, name: string, phone: string, password: string) => {
    await axi.post("/users/register/", { email, name, phone, password })
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
    console.log(response)
    return response;
};

export const approveRequestSeller = async (idUser: number | string) => {
    await axi.post(`/users/sell/approve_request/${idUser}/`);
};

export const deleteRequestSeller = async (idUser: number | string) => {
    await axi.delete(`/users/sell/delete_request/${idUser}/`);
};

export const sendRequestSellerPayPalConfig = async (idUser: number | string, formData: FormData) => {
    await axi.post(`/users/sell/paypalsel/${idUser}/`, formData);
};