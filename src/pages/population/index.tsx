import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useTypedSelector } from "@/config/redux";
import { firebaseDeleteDocument, firebaseReadData } from "@/config/firebase";

interface Population {
  address: string;
  date: string;
  email: string;
  id: string;
  name: string;
  nik: number;
  number: number;
  sex: string
  status: string;
  createdAt: string;
}

type Populations = Population[];

const Population: NextPage = () => {
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [populations, setPopulations] = useState<Populations>([]);

  const getData = useCallback(() => {
    firebaseReadData("population").then((res: any) => setPopulations(res));
  }, []);

  const removePopulation = (id: string) => {
    firebaseDeleteDocument("population", id)
      .then(() => getData())
      .catch((e) => console.log("gagal", e));
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container-penduduk">
      <h3>DATA PENDUDUK</h3>
      <div className="container-main">
        <table className="text-gray-600">
          <thead>
            <tr>
              <th className="text-center">NO</th>
              <th>NAMA</th>
              <th>TANGGAL LAHIR</th>
              <th>ALAMAT</th>
              <th>PEKERJAAN</th>
              <th>NO HP</th>
              {isLogin && <th className="text-center">OPSI</th>}
            </tr>
          </thead>
          <tbody>
            {populations
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
                  {isLogin && (
                    <td className="option">
                      <button id="edit">
                        <Link href={"/population/" + pop.id}>
                          <i className="fas fa-edit" />
                        </Link>
                      </button>
                      <button
                        onClick={() => removePopulation(pop.id)}
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

export default Population;

const data = (pop: Population) => {
  return [
    { id: "name", text: "Nama", value: pop.name },
    { id: "date", text: "Tanggal lahir", value: new Date(pop.date).toLocaleDateString() },
    { id: "address", text: "Alamat", value: pop.address },
    { id: "status", text: "Pekerjaan", value: pop.status },
    { id: "number", text: "NO HP", value: pop.number },
  ];
};
