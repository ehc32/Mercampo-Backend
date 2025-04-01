import { authAxios } from "./useAxios"

// Obtener la configuración de Mercado Pago del vendedor
export const get_mercadopago_config = async (sellerId: number) => {
  try {
    const response = await authAxios.get(`users/mercado-pago/config/done/${sellerId}/`)
    return response.data
  } catch (error) {
    console.error(`Error al obtener configuración de Mercado Pago del vendedor ${sellerId}:`, error)
    throw error
  }
}

// Guardar la configuración de Mercado Pago para un usuario
export const save_mercadopago_config = async (data: {
  user_id: number;  // Hacer obligatorio el user_id
  public_key: string;
  access_token: string;
  refresh_token?: string;
}) => {
  try {
    // Validación de campos requeridos
    if (!data.user_id) {
      throw new Error("El user_id es requerido");
    }
    if (!data.public_key) {
      throw new Error("El public_key es requerido");
    }
    if (!data.access_token) {
      throw new Error("El access_token es requerido");
    }

    // Preparar el payload según la estructura de tu tabla SQL
    const payload = {
      user_id: data.user_id,  // Usar el nombre exacto del campo en tu DB
      public_key: data.public_key,
      access_token: data.access_token,
      refresh_token: data.refresh_token || "dasdasdas",  // Enviar null si no viene
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await authAxios.post(`users/mercado-pago/config/${data.user_id}/`, payload);

    return { 
      success: true, 
      data: response.data 
    };
  } catch (error: any) {
    console.error("Error saving MercadoPago config:", error);
    
    // Mejor manejo de errores
    let errorMessage = "Error al guardar la configuración";
    if (error.response) {
      if (error.response.data) {
        errorMessage = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      } else {
        errorMessage = error.response.statusText || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};