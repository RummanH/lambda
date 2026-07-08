import { api } from './api';

export interface Item {
  id: string;
  name: string;
}

// Thin wrapper around the NestJS /items endpoints (see backend/src/items).
export const itemsService = {
  async getAll(): Promise<Item[]> {
    const { data } = await api.get<Item[]>('/items');
    return data;
  },

  async create(name: string): Promise<Item> {
    const { data } = await api.post<Item>('/items', { name });
    return data;
  },

  async update(id: string, name: string): Promise<Item> {
    const { data } = await api.patch<Item>(`/items/${id}`, { name });
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/items/${id}`);
  },
};
