import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useTypedSelector } from "@/config/redux";
import { firebaseDeleteDocument, firebaseReadSingleData } from "@/config/firebase";
import { useDispatch } from "react-redux";
import { updateDoc } from "@/config/redux/action";

type Data = {
  id: string;
  text: string;
  value: string;
  disable:boolean;
  type:string;
}[];

const Detail: NextPage = () => {
  const [data, setData] = useState<Data>([]);
  const [resident, setResident] = useState({})
  const { query, push, replace }: any = useRouter();
  const dispatch = useDispatch()
  const { isLogin } = useTypedSelector((state)=> state.authReducer)

  const getData = useCallback(() => {
    firebaseReadSingleData("resident", query.detail)
    .then((response: any) => {
      const result = [
        { id: "name", text: "Nama", value: response?.name ,disable:false, type:"text" },
        { id: "number", text: "NO HP", value: response?.number ,disable:false, type:"number" },
        { id: "job", text: "Pekerjaan", value: response?.job ,disable:false, type:"text" },
        { id: "nik", text: "NIK", value: response?.nik, disable:false, type:"number" },
        { id: "email", text: "Email", value: response?.email ,disable:false, type:"text" },
        { id: "date", text: "Tanggal lahir", value: new Date(response?.date).toLocaleDateString() ,disable: true, type: "text" },
        { id: "sex", text: "Jenis kelamin", value: response?.sex ,disable:true, type:"text" },
        { id: "address", text: "Alamat", value: response?.address ,disable:true, type:"text" },
      ];
      setData(result);
      setResident(response)
    })
    .catch((e) => console.log("error", e));
  },[query.detail])

  const changeValue = (e:ChangeEvent<HTMLInputElement>, idx:number) => {
    data[idx].value = e.target.value;
    setResident({...resident, [e.target.id]: e.target.value})
    setData([...data]);
  }

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (!isLogin) replace("/");
  }, [isLogin,replace]);

  return (
    <div className="container-penduduk">
      <h3 className="uppercase">permintaan data</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(updateDoc("resident", query.detail, resident, push("/resident")))
        }}
        className="container-main border-b-2"
      >
        <div className="space-y-2 ">
          {data.map((el,i) => (
            <div key={el.id} className="flex">
              <label className="flex-1" htmlFor={el.id}>
                {el.text}
              </label>
              <input
                className="flex-[3] border"
                id={el.id}
                name={el.id}
                type={el.type}
                value={el.value}
                disabled={el.disable}
                onChange={(e)=>changeValue(e,i)}
              />
            </div>
          ))}
        </div>
        <div className="flex space-x-3 justify-end mt-5">
          <button
            onClick={() =>
              firebaseDeleteDocument("resident", query.detail)
                .then(() => push("/resident"))
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
    </div>
  );
};

export default Detail;
