export interface Item {
  done: boolean;
  email: string;
  name: string;
  id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ItemDisplay extends Item {
  checkboxOutlineType: string;
  color: string;
  size: number;
}

export const demoAccount = {
  email: 'demo@nativescript.org',
  password: '12345',
};
