import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useTypedSelector } from "@/config/redux";
import { firebaseDeleteDocument, firebaseReadData } from "@/config/firebase";

interface Resident {
  address: string;
  date: string;
  email: string;
  id: string;
  name: string;
  nik: number;
  number: number;
  sex: string;
  job: string;
  createdAt: string;
}

type Residents = Resident[];

const Resident: NextPage = () => {
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [residents, setResidents] = useState<Residents>([]);

  const getData = useCallback(() => {
    firebaseReadData("resident").then((res: any) => setResidents(res));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container-penduduk">
      <h3>DATA CALON PENDUDUK</h3>
      <div className="container-main">
        <table className="text-gray-600">
          <thead>
            <tr>
              <th className="text-center">NO</th>
              <th>NAMA</th>
              <th>TANGGAL LAHIR</th>
              <th>NO HP</th>
              <th>Status</th>
              {isLogin && <th className="text-center">OPSI</th>}
            </tr>
          </thead>
          <tbody>
            {residents
              .sort((a, b) => {
                if (a.createdAt > b.createdAt) return 1;
                if (a.createdAt < b.createdAt) return -1;
                return 0;
              })
              .map((pop, i) => (
                <tr key={pop.id}>
                  <td className="text-center">{i + 1}</td>
                  {data(pop).map((el) => (
                    <td key={pop.id + el.id}>{el.value}</td>
                  ))}
                  <td className="flex items-center">
                    <span className="bg-green-400 text-white px-1 rounded-sm">Selesai</span>
                  </td>
                  {isLogin && (
                    <td className="option">
                      <button id="edit">
                        <Link href={"/resident/" + pop.id}>
                          <i className="fas fa-edit" />
                        </Link>
                      </button>
                      <button
                        onClick={() =>
                          firebaseDeleteDocument("resident", pop.id)
                            .then(() => getData())
                            .catch((e) => console.log("gagal", e))
                        }
                        id="remove"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resident;

const data = (pop: Resident) => {
  return [
    { id: "name", text: "Nama", value: pop.name },
    {
      id: "date",
      text: "Tanggal lahir",
      value: new Date(pop.date).toLocaleDateString(),
    },
    { id: "number", text: "NO HP", value: pop.number },
  ];
};
