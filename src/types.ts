export interface Reading {
  id: number;
  systolic: number;
  diastolic: number;
  heartRate: number | null;
  time: string;
  editedAt: string | null;
}

export interface ReadingGroup {
  date: string;
  am: Reading[];
  pm: Reading[];
}


