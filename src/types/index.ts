export interface Resident {
  id?: string;
  address: string;
  date: string;
  email: string;
  name: string;
  nik: number;
  number: number;
  sex: string;
  job: string;
  status: string;
  note?: string;
  createdAt: string;
  category: string;
  file: {
    name: string;
    url: string;
  };
}

export const initialResident: Resident = {
  id: "",
  address: "",
  date: "",
  email: "",
  name: "",
  nik: 0,
  number: 0,
  sex: "",
  job: "",
  status: "",
  note: "",
  createdAt: "",
  category: "",
  file: {
    name: "",
    url: "",
  },
};
