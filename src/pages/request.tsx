import { firebaseDeleteDocument, firebaseReadData } from "@/config/firebase";
import { useTypedSelector } from "@/config/redux";
import { saveData } from "@/config/redux/action";
import { ActionType } from "@/config/redux/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface Request {
  address: string;
  date: string;
  email: string;
  id: string;
  name: string;
  nik: number;
  number: number;
  sex: string;
  status: string;
  createdAt: string;
}

type Requests = Request[];

const Request: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [requests, setRequests] = useState<Requests>([]);

  useEffect(() => {
    if (!isLogin) router.replace("/");
  }, [router, isLogin]);

  const getData = useCallback(() => {
    dispatch({ type: ActionType.CHANGE_LOADING, payload: true });
    firebaseReadData("temp")
      .then((data: any) => setRequests(data))
      .catch((e) => alert(e))
      .finally(() =>
        dispatch({ type: ActionType.CHANGE_LOADING, payload: false })
      );
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container-penduduk">
      <h3 className="uppercase">permintaan data</h3>
      {requests.map((req) => (
        <form
          key={req.id}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(saveData(req, "temp", "resident", getData));
          }}
          className="container-main border-b-2"
        >
          <div className="space-y-2 ">
            {data(req).map((el) => (
              <div key={req.id + el.id} className="flex">
                <label className="flex-1" htmlFor={req.id + el.id}>
                  {el.text}
                </label>
                <input
                  className="flex-[3]"
                  id={req.id + el.id}
                  value={el.value}
                  name={el.id}
                  disabled
                />
              </div>
            ))}
          </div>
          <div className="flex space-x-3 justify-end mt-5">
            <button
              onClick={() =>
                firebaseDeleteDocument("temp", req.id)
                  .then(() => getData())
                  .catch((e) => console.log(e))
              }
              type="button"
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Simpan
            </button>
          </div>
        </form>
      ))}
    </div>
  );
};

export default Request;

const data = (req: Request) => {
  return [
    { id: "nik", text: "NIK", value: req.nik },
    { id: "name", text: "Nama", value: req.name },
    { id: "email", text: "Email", value: req.email },
    { id: "number", text: "NO HP", value: req.number },
    { id: "date", text: "Tanggal lahir", value: new Date(req.date).toLocaleDateString() },
    { id: "status", text: "Pekerjaan", value: req.status },
    { id: "address", text: "Alamat", value: req.address },
    { id: "sex", text: "Jenis kelamin", value: req.sex },
  ];
};
