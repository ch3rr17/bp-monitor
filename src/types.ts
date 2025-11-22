export interface Reading {
  systolic: number;
  diastolic: number;
  time: string;
}

export interface ReadingGroup {
  date: string;
  am: Reading[];
  pm: Reading[];
}


