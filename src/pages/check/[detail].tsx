import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useTypedSelector } from "@/config/redux";
import {
  firebaseDeleteDocument,
  firebaseReadSingleData,
} from "@/config/firebase";
import { useDispatch } from "react-redux";
import { updateDoc } from "@/config/redux/action";
import useAddress from "@/lib/useAddress";

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
  status: string;
  createdAt: string;
}

interface AdressData {
  data: { id: number; nama: string }[];
  selected: { id: number; name: string };
}

type AddressInputs = {
  name: "provinsi" | "kota" | "kecamatan" | "kelurahan";
  text: string;
  data: AdressData;
  default: string;
}[];

const DetailCheck: NextPage = () => {
  const { address, changeOption } = useAddress();
  const { query, push, replace }: any = useRouter();
  const dispatch = useDispatch();
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [resident, setResident] = useState<Resident>({
    address: "",
    date: "",
    email: "",
    id: "",
    name: "",
    nik: 0,
    number: 0,
    sex: "",
    job: "",
    status: "",
    createdAt: "",
  });

  const getData = useCallback(() => {
    firebaseReadSingleData("resident", query.detail)
      .then((response: any) => setResident(response))
      .catch((e) => console.log("error", e));
  }, [query.detail]);

  const inputs = [
    { id: "nik", text: "NIK", type: "number", value: resident.nik },
    { id: "name", text: "Nama", type: "text", value: resident.name },
    { id: "email", text: "Email", type: "email", value: resident.email },
    { id: "number", text: "NO HP", type: "number", value: resident.number },
    { id: "job", text: "Pekerjaan", type: "text", value: resident.job },
    {
      id: "date",
      text: "Tanggal lahir",
      type: "date",
      value: resident?.date.split("T")[0],
    },
  ];

  const addressInputs: AddressInputs = [
    {
      name: "provinsi",
      text: "Provinsi",
      data: address.provinsi,
      default: resident?.address.split(", ")[3],
    },
    {
      name: "kota",
      text: "Kota/Kabupaten",
      data: address.kota,
      default: resident?.address.split(", ")[2],
    },
    {
      name: "kecamatan",
      text: "Kecamatan",
      data: address.kecamatan,
      default: resident?.address.split(", ")[1],
    },
    {
      name: "kelurahan",
      text: "Kelurahan",
      data: address.kelurahan,
      default: resident?.address.split(", ")[0],
    },
  ];

  const changeValue = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    setResident({ ...resident, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  // useEffect(() => {
  //   if (!isLogin) replace("/");
  // }, [isLogin,replace]);

  return (
    <div className="container-penduduk">
      <h3 className="uppercase">{resident.name}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(
            updateDoc("resident", query.detail, resident, push("/resident"))
          );
        }}
        className="container-main border-b-2"
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
                name={el.id}
                type={el.type}
                value={el.value}
                onChange={(e) => changeValue(e, i)}
              />
            </div>
          ))}
          <div className="label-input flex items-center">
            <p className="flex-1">Jenis kelamin</p>
            <div className="flex-[3] flex space-x-6">
              <div className="flex items-center space-x-3">
                <input
                  onChange={(e) =>
                    setResident({ ...resident, sex: e.target.value })
                  }
                  checked={resident.sex === "Laki - laki"}
                  id="male"
                  value="Laki - laki"
                  name="sex"
                  type="radio"
                />
                <label htmlFor="male">Laki - laki</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  onChange={(e) =>
                    setResident({ ...resident, sex: e.target.value })
                  }
                  checked={resident.sex === "Perempuan"}
                  id="female"
                  value="Perempuan"
                  name="sex"
                  type="radio"
                />
                <label htmlFor="female">Perempuan</label>
              </div>
            </div>
          </div>
          <div className="label-input flex items-center">
            <p className="flex-1">Alamat</p>
            <div className="flex-[3] flex space-x-3">
              {addressInputs.map((input, i) => (
                <select
                  key={i}
                  name={input.name}
                  value={input.data.selected.id || "default"}
                  onChange={(e) => changeOption(e, input.name)}
                >
                  <option value="default" disabled>
                    {input.default}
                  </option>
                  {input.data.data.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.nama}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
          <div className="flex">
            <p className="flex-1">Status</p>
            <select
              disabled
              value={resident.status}
              className="flex-[3] text-blue-500 font-semibold text-lg"
            >
              {status.map((stat, i) => (
                <option key={i} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
          </div>
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

export default DetailCheck;

const status = ["pending", "waiting", "onprogress", "success", "failed"];
