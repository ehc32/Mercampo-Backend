

export interface Product {
    id?: number;
    name: string;
    slug?: string;
    description: string;
    price: number;
    rating?: number;
    count_in_stock: number;
    category: string;
    image: File | null;
    quantity?: number;
    num_reviews?: number;
    unit?: string;
    map_locate?: string;
    locate?: string;

}

export interface Order {
    total_price: number;
    address: string
    city: string
    postal_code: string
    order_items: Product[]
};


export interface User {
    role: string;
    id?: number;
    avatar?: File | null;
    email: string;
    phone: string;
    password: string;
    name: string;
};

export interface Token {
    user_id: number;
    userId: number;
    exp: number;
    is_staff: boolean;
    email: string;
    enterprise: any;
    name: string;
    phone: string;
    role: string;
    avatar: File | null;
};
