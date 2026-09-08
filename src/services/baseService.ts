import Pedido from "../types/Pedido";
import PreferenceMP from "../types/PreferenceMP";
import { AbstractBaseService } from "./abstractBaseService";
import { API_URL } from "../utils/api";

// Clase abstracta que proporciona métodos genéricos para interactuar con una API
export default abstract class BaseService<T> extends AbstractBaseService<T> {
  // Método protegido para realizar una solicitud genérica
  protected async request(path: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        console.log(response.statusText);
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Método protegido para realizar una solicitud genérica para obtener todos los elementos
  protected async requestAll(path: string, options: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Método para obtener un elemento por su ID
  async get(url: string, id: number): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options);
  }

  // Método para obtener todos los elementos
  async getAll(url: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options);
  }

  // Método para crear un nuevo elemento
  async post(url: string, data: T): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(path, options);
  }

  // Método para actualizar un elemento existente por su ID
  async put(url: string, id: number, data: T): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  // Método para eliminar un elemento por su ID
  async delete(url: string, id: number): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await fetch(path, options);
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      throw new Error("Error al eliminar el elemento");
    }
  }

  // Método para guardar archivos
  async saveWithFile(
    url: string,
    formData: FormData
  ): Promise<string> {
    try {
      const options: RequestInit = {
        method: "POST",
        body: formData,
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `Error al guardar la imagen del producto: ${response.statusText}`
        );
      }
      return response.text();

    } catch (error) {
      throw new Error("Error al guardar la imagen del producto");
    }
  }

  // Crear preferencia de Mercado Pago
  async createPreferenceMP(
    pedido: Pedido
  ): Promise<PreferenceMP> {

    const urlServer =
      `${API_URL}/api/mercado_pago/create_preference`;
    try {
      const response = await fetch(urlServer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        throw new Error(
          `Error al crear preferencia de Mercado Pago: ${response.statusText}`
        );
      }

      const responseData = await response.json();

      console.log(
        "Respuesta de la API:",
        responseData
      );

      return responseData as PreferenceMP;
    } catch (error) {
      console.error(
        "Error en createPreferenceMP:",
        error
      );

      throw error;
    }
  }
}

