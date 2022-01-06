import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useTypedSelector } from "@/config/redux";
import { firebaseDeleteDocument, firebaseReadSingleData } from "@/config/firebase";
import { useDispatch } from "react-redux";
import { updateDoc } from "@/config/redux/action";
import {  initialResident, Resident } from "@/types";

const Detail: NextPage = () => {
  const { query, push, replace }: any = useRouter();
  const dispatch = useDispatch();
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [resident, setResident] = useState<Resident>();

  const getData = useCallback(() => {
    firebaseReadSingleData("resident", query.detail)
      .then((response: any) => setResident(response))
      .catch((e) => console.log("error", e));
  }, [query.detail]);

  const inputs = [
    { id: "nik", text: "NIK", type: "number", value: resident?.nik },
    { id: "name", text: "Nama", type: "text", value: resident?.name },
    { id: "email", text: "Email", type: "email", value: resident?.email },
    { id: "number", text: "NO HP", type: "number", value: resident?.number },
    { id: "job", text: "Pekerjaan", type: "text", value: resident?.job },
    { id: "sex", text: "Jenis kelamin", type: "text", value: resident?.sex },
    { id: "address", text: "Alamat", type: "text", value: resident?.address },
    { id: "date", text: "Tanggal lahir", type: "date", value: resident?.date.split("T")[0] },
  ];

  useEffect(() => {
    getData();
    return () => setResident(initialResident)
  }, [getData]);

  useEffect(() => {
    if (!isLogin) replace("/");
  }, [replace, isLogin]);

  return (
    <div className="container-penduduk">
      <h3 className="uppercase">{resident?.name}</h3>
      <form
        className="container-main border-b-2"
        onSubmit={(e) => {
          e.preventDefault();
          if(resident?.name)dispatch(updateDoc("resident", query.detail, resident, push("/resident")));
        }}
      >
        <div className="space-y-2 ">
          {inputs.map((el, i) => (
            <div key={el.id} className="flex">
              <label className="flex-1" htmlFor={el.id}>
                {el.text}
              </label>
              <input
                className="flex-[3] border px-2"
                id={el.id}
                type={el.type}
                value={el.value}
                disabled
              />
            </div>
          ))}
          <div className="flex">
            <p className="flex-1">Status</p>
            <div className="flex-[3]">
              <select
                value={resident?.status}
                onChange={(e) =>setResident((crr):any => ({ ...crr, status: e.target.value }))}
                className={`${
                  status(resident?.status || "pending").bgColor
                } font-semibold text-lg`}
              >
                {stats.map((stat, i) => (
                  <option key={i} value={stat}>
                    {status(stat).text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <textarea
            name="note"
            value={resident?.note}
            className="border w-full h-[300px] p-2 resize-none"
            onChange={(e) => setResident((crr):any => ({...crr,note: e.target.value}))}
            placeholder={`beritahu ${resident?.name} apa saja yang kurang dan perlu ditambahkan\nmisal: NIK kamu tidak terdaftar DUKCAPIL...`}
          ></textarea>
        </div>
        <div className="flex space-x-3 justify-end mt-5">
          <button
            onClick={() =>{
              const confirm = (window.confirm(`Hapus data ${resident?.name}?`))
              if(confirm)
                firebaseDeleteDocument("resident", query.detail)
                  .then(() => push("/resident"))
                  .catch((e) => console.log(e))}
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
    </div>
  );
};

export default Detail;

const stats = ["pending", "waiting", "onprogress", "success", "failed"];

function status(stat: string) {
  switch (stat) {
    case "pending":
      return {
        text: "Menunggu konfirmasi",
        bgColor: "bg-gray-300",
      };
    case "waiting":
      return {
        text: "Dalam antrean",
        bgColor: "bg-blue-300",
      };
    case "onprogress":
      return {
        text: "Diproses",
        bgColor: "bg-yellow-300",
      };
    case "success":
      return {
        text: "Sukses",
        bgColor: "bg-green-300",
      };
    case "failed":
      return {
        text: "Gagal",
        bgColor: "bg-red-300",
      };
    default:
      return {
        text: "Menunggu konfirmasi",
        bgColor: "bg-gray-300",
      };
  }
}