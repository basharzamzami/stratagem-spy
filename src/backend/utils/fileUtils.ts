
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readJsonFile<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function filterByQuery<T extends Record<string, any>>(
  data: T[],
  query: Record<string, string | undefined>,
  searchFields: (keyof T)[]
): T[] {
  return data.filter(item => {
    return Object.entries(query).every(([key, value]) => {
      if (!value) return true;
      
      if (searchFields.includes(key as keyof T)) {
        const itemValue = item[key as keyof T];
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        if (Array.isArray(itemValue)) {
          return itemValue.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(value.toLowerCase())
          );
        }
      }
      
      return String(item[key as keyof T]).toLowerCase() === value.toLowerCase();
    });
  });
}
