import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useAddress, { AddressData } from "@/lib/useAddress";
import { addData, uploadFile } from "@/config/redux/action";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useTypedSelector } from "@/config/redux";
import { firebaseReadData } from "@/config/firebase";
import { ActionType } from "@/config/redux/types";

type AddressInputs = {
  name: "provinsi" | "kota" | "kecamatan" | "kelurahan";
  text: string;
  data: AddressData;
}[];

const Registration: NextPage = () => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { replace } = useRouter();
  const { address, changeOption } = useAddress();
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const [file, setFile] = useState("");
  const [form, setForm] = useState({
    nik: 0,
    name: "",
    email: "",
    number: 0,
    date: "",
    job: "",
    sex: "Laki - laki",
    address: "",
    status: "pending",
    createdAt: "",
    category: "",
    file: {
      name: "",
      url: "",
    },
  });

  const inputs = [
    { id: "nik", label: "NIK", type: "number", value: form.nik },
    { id: "name", label: "Nama", type: "text", value: form.name },
    { id: "email", label: "Email", type: "email", value: form.email },
    { id: "number", label: "NO HP", type: "number", value: form.number },
    { id: "job", label: "Pekerjaan", type: "text", value: form.job },
    { id: "date", label: "Tanggal lahir", type: "date", value: form.date },
  ];

  const addressInputs: AddressInputs = [
    { name: "provinsi", text: "Provinsi", data: address.provinsi },
    { name: "kota", text: "Kota/Kabupaten", data: address.kota },
    { name: "kecamatan", text: "Kecamatan", data: address.kecamatan },
    { name: "kelurahan", text: "Kelurahan", data: address.kelurahan },
  ];

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    dispatch({ type: ActionType.CHANGE_LOADING, payload: true });

    const { nik, name, email, number, date, job, category } = form;
    const { provinsi, kota, kecamatan, kelurahan } = address;

    if (!nik || !name || !email || !number || !date || !job || !category || !provinsi.selected.id || !kota.selected.id || !kecamatan.selected.id || !kelurahan.selected.id || !form.file.name) {
      dispatch({ type: ActionType.CHANGE_LOADING, payload: false });
      return alert("belum lengkap");
    }

    const getData: any = await firebaseReadData("resident");

    if (getData.some((data: any) => data.nik === nik)) {
      dispatch({ type: ActionType.CHANGE_LOADING, payload: false });
      return alert("NIK telah digunakan!");
    }

    if (getData.some((data: any) => data.email === email)) {
      dispatch({ type: ActionType.CHANGE_LOADING, payload: false });
      return alert("Email telah digunakan!");
    }

    form.address = `${kelurahan.selected.name}, ${kecamatan.selected.name}, ${kota.selected.name}, ${provinsi.selected.name}`;

    form.date = new Date(form.date).toISOString();

    form.createdAt = new Date(Date.now()).toISOString();

    dispatch(
      addData(form, "resident", () => {
        alert("data anda telah masuk ke permintaan\nmohon tunggu 2x24 jam, admin akan mengonfirmasi data anda");
        push("/");
      })
    );
  };

  useEffect(() => {
    if (isLogin) replace("/");
  }, [isLogin, replace]);

  useEffect(() => {
    return () => {
      setFile(Math.random().toString(36));
      setForm({
        nik: 0,
        name: "",
        email: "",
        number: 0,
        date: "",
        job: "",
        sex: "Laki - laki",
        address: "",
        status: "pending",
        createdAt: "",
        category: "",
        file: {
          name: "",
          url: "",
        },
      });
    }
  }, []);

  const changeFile = (e: any) => {
    if (!form.nik) {
      setFile(Math.random().toString(36));
      return alert("masukkan NIK terlebih dahulu!");
    }
    const filename = `${form.nik}.rar`;
    e.target.files?.length &&
      dispatch(
        uploadFile(e?.target.files[0], filename, (url: string) =>
          setForm((crr): any => ({
            ...crr,
            file: { name: `${form.nik}.rar`, url },
          }))
        )
      );
  };

  return (
    <div className="container-penduduk">
      <h3>REGISTRASI</h3>
      <form onSubmit={(e) => onSubmit(e)} className="container-main space-y-2">
        {inputs.map((input, i) => (
          <div key={i} className="label-input">
            <label className="w-[200px] inline-block" htmlFor={input.id}>
              {input.label}
            </label>
            <input
              onChange={(e) => onChange(e)}
              className="border w-1/2 px-px"
              id={input.id}
              name={input.id}
              type={input.type}
            />
          </div>
        ))}
        <div className="label-input flex items-center">
          <p className="w-[200px] inline-block">Jenis kelamin</p>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-3">
              <input
                onChange={(e) => onChange(e)}
                defaultChecked
                id="male"
                value="Laki - laki"
                name="sex"
                type="radio"
              />
              <label htmlFor="male">Laki - laki</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                onChange={(e) => onChange(e)}
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
          <p className="w-[200px]">Alamat</p>
          <div className="flex space-x-6">
            {addressInputs.map((input, i) => (
              <select
                key={i}
                name={input.name}
                value={input.data.selected.id || "default"}
                onChange={(e) => changeOption(e, input.name)}
              >
                <option value="default" disabled>
                  {input.text}
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
        <div className="label-input flex items-center">
          <p className="w-[200px]">Keterangan</p>
          <div className="flex space-x-6">
            <select
              name="category"
              value={form.category || "default"}
              onChange={(e) =>
                setForm((crr) => ({ ...crr, category: e.target.value }))
              }
            >
              <option disabled value="default">
                keterangan
              </option>
              {categories.map((cat, i) => (
                <option value={cat} key={i}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="label-input">
          <label className="w-[200px] inline-block" htmlFor="file">
            Unggah berkas (*.rar)
          </label>
          <input
            onChange={(e) => changeFile(e)}
            id="file"
            name="file"
            type="file"
            accept=".rar"
            key={file || ""}
          />
          {form.file.url && (
            <a href={form.file.url} className="text-blue-600 hover:underline">
              {form.file.name}
            </a>
          )}
        </div>
        <div className="flex justify-end mt-10">
          <button type="submit" name="submit" className="bg-blue-400">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;

const categories = [
  "Akta Kelahiran",
  "Akta Kematian",
  "KTP Elektronik",
  "KTP Hilang",
  "KTP Rusak",
  "Surat Pindah",
  "Surat Datang",
  "Pembuatan KK Baru",
  "Persyaratan Peubahan KK",
  "Pembuatan KIA",
  "KIA Perpanjang",
  "KIA Hilang",
];
