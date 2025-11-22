import { ReadingGroup } from './types';

const API_BASE = '/api';

export async function fetchReadings(): Promise<ReadingGroup[]> {
  const response = await fetch(`${API_BASE}/readings`);
  if (!response.ok) {
    throw new Error('Failed to fetch readings');
  }
  return response.json();
}

export async function createReading(systolic: number, diastolic: number, heartRate?: number | null): Promise<void> {
  const response = await fetch(`${API_BASE}/readings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ systolic, diastolic, heartRate: heartRate || null }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create reading');
  }
}

export async function updateReading(id: number, systolic: number, diastolic: number, heartRate?: number | null): Promise<void> {
  const response = await fetch(`${API_BASE}/readings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ systolic, diastolic, heartRate: heartRate || null }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update reading');
  }
}

