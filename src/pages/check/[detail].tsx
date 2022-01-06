import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useTypedSelector } from "@/config/redux";
import { firebaseDeleteDocument, firebaseReadSingleData } from "@/config/firebase";
import { useDispatch } from "react-redux";
import { updateDoc } from "@/config/redux/action";
import useAddress, { AddressData } from "@/lib/useAddress";
import { initialResident, Resident } from "@/types";

type AddressInputs = {
  name: "provinsi" | "kota" | "kecamatan" | "kelurahan";
  text: string;
  data: AddressData;
  default: string;
}[];

const DetailCheck: NextPage = () => {
  const [resident, setResident] = useState<Resident>();
  const { query, push, replace }: any = useRouter();
  const dispatch = useDispatch();
  const { address, changeOption } = useAddress();
  const { isLogin } = useTypedSelector((state) => state.authReducer);

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
    { id: "date", text: "Tanggal lahir", type: "date", value: resident?.date.split("T")[0] },
  ];

  const addressInputs: AddressInputs = [
    {
      name: "provinsi",
      text: "Provinsi",
      data: address.provinsi,
      default: resident?.address.split(", ")[3] || "",
    },
    {
      name: "kota",
      text: "Kota/Kabupaten",
      data: address.kota,
      default: resident?.address.split(", ")[2] || "",
    },
    {
      name: "kecamatan",
      text: "Kecamatan",
      data: address.kecamatan,
      default: resident?.address.split(", ")[1] || "",
    },
    {
      name: "kelurahan",
      text: "Kelurahan",
      data: address.kelurahan,
      default: resident?.address.split(", ")[0] || "",
    },
  ];

  const changeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setResident((crr): any => ({ ...crr, [e.target.id]: e.target.value }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const { provinsi, kota, kecamatan, kelurahan } = address;
    if ( !provinsi.selected.id || !kota.selected.id || !kecamatan.selected.id || !kelurahan.selected.id) return alert("alamat belum lengkap,\ninput ulang alamat");

    if (resident?.name) {
      resident.address = `${kelurahan.selected.name}, ${kecamatan.selected.name}, ${kota.selected.name}, ${provinsi.selected.name}`;
      resident.date = new Date(resident.date).toISOString();
      resident.createdAt = new Date(Date.now()).toISOString();
      resident.status = "pending";
      dispatch(updateDoc("resident", query.detail, resident, push("/resident")));
    }
  };

  useEffect(() => {
    getData();
    return () => setResident(initialResident)
  }, [getData]);

  useEffect(() => {
    if (isLogin) replace("/");
  }, [isLogin, replace]);

  return (
    <div className="container-penduduk">
      <h3 className="uppercase">{resident?.name}</h3>
      <form onSubmit={(e) => submit(e)} className="container-main border-b-2">
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
                onChange={(e) => changeValue(e)}
                disabled={resident?.status !== "failed"}
              />
            </div>
          ))}
          <div className="label-input flex items-center">
            <p className="flex-1">Jenis kelamin</p>
            <div className="flex-[3] flex space-x-6">
              <div className="flex items-center space-x-3">
                <input
                  onChange={(e) =>
                    setResident((crr):any => ({ ...crr, sex: e.target.value }))
                  }
                  disabled={resident?.status !== "failed"}
                  checked={resident?.sex === "Laki - laki"}
                  id="male"
                  value="Laki - laki"
                  name="sex"
                  type="radio"
                />
                <label htmlFor="male">Laki - laki</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  disabled={resident?.status !== "failed"}
                  onChange={(e) =>
                    setResident((crr):any=> ({ ...crr, sex: e.target.value }))
                  }
                  checked={resident?.sex === "Perempuan"}
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
                  disabled={resident?.status !== "failed"}
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
            <div className="flex-[3]">
              <select
                disabled
                value={resident?.status}
                className={`${
                  status(resident?.status || "").bgColor
                }  font-semibold text-lg`}
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
            className="border w-full h-[300px] p-2 resize-none text-gray-500"
            value={resident?.note}
            disabled
          ></textarea>
        </div>
        <div className="flex space-x-3 justify-end mt-5">
          <button
            disabled={resident?.status !== "failed"}
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
          <button
            disabled={resident?.status !== "failed"}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailCheck;

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