import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import { useTypedSelector } from "@/config/redux";
import { firebaseReadData } from "@/config/firebase";
import { useRouter } from "next/router";
import status from "@/utils/status";
import { Resident } from "@/types";

const Resident: NextPage = () => {
  const { push, replace } = useRouter();
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [residents, setResidents] = useState<Resident[]>([]);

  const getData = useCallback(() => {
    firebaseReadData("resident").then((res: any) => setResidents(res));
  }, []);

  useEffect(() => {
    getData();
    return () => setResidents([])
  }, [getData]);

  useEffect(() => {
    if (!isLogin) replace("/");
  }, [replace, isLogin]);

  return (
    <div className="container-penduduk">
      <h3>DATA CALON PENDUDUK</h3>
      <div className="container-main">
        <table className="text-gray-600">
          <thead>
            <tr>
              <th className="text-center">NO</th>
              <th>NIK</th>
              <th>Email</th>
              <th>Nama</th>
              <th>Status</th>
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
                <tr
                  key={pop.id}
                  className="cursor-pointer group text-gray-600"
                  onClick={() => push(`/resident/${pop.id}`)}
                >
                  <td className="text-center group-hover:text-blue-500">
                    {i + 1}
                  </td>
                  {data(pop).map((el) => (
                    <td
                      key={pop.id + el.id}
                      className="group-hover:text-blue-500"
                    >
                      {el.value}
                    </td>
                  ))}
                  <td className="flex items-center">
                    <span
                      className={`${
                        status(pop.status).bgColor
                      } px-1 rounded-sm`}
                    >
                      {status(pop.status).text}
                    </span>
                  </td>
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
    { id: "nik", text: "NIK", value: pop.nik },
    { id: "email", text: "Email", value: pop.email },
    { id: "name", text: "Nama", value: pop.name },
  ];
};