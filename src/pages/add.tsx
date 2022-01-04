import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import useAddress from "@/lib/useAddress";
import { addData } from "@/config/redux/action";
import { useRouter } from "next/router";

interface Data {
  data: { id: number; nama: string }[];
  selected: string;
}

type Inputs = {
  name: string;
  text: string;
  data: Data;
}[];

export default function Add() {
  const { push } = useRouter()
  const dispatch = useDispatch()
  const { address, changeOption } = useAddress();
  const [form, setForm] = useState({ nik: 0, name: "", email: "", number: 0, date: "", status: "", sex: "Laki - laki", address: "", createdAt:"" });

  const inputs = [
    { id: "nik", label: "NIK", type: "number", value: form.nik },
    { id: "name", label: "Nama", type: "text", value: form.name },
    { id: "email", label: "Email", type: "email", value: form.email },
    { id: "number", label: "NO HP", type: "number", value: form.number },
    { id: "status", label: "Pekerjaan", type: "text", value: form.status },
    { id: "date", label: "Tanggal lahir", type: "date", value: form.date },
  ];

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { nik, name, email, number, date, status } = form;
    const { province, city, district, ward } = address;

    if (!nik || !name || !email || !number || !date || !status || !province.selected || !city.selected || !district.selected || !ward.selected) {
      return alert("belum lengkap");
    }

    form.address = `${ward.selected.split("-")[1]}, ${district.selected.split("-")[1]}, ${city.selected.split("-")[1]}, ${province.selected.split("-")[1]}`;

    form.date = new Date(form.date).toISOString();

    form.createdAt = new Date(Date.now()).toISOString();
    
    dispatch(addData(form, "tempPopulation",() => {
      alert("data anda telah masuk ke permintaan\nmohon tunggu 2x24 jam, admin akan mengonfirmasi data anda");
      push("/");
    }))
  };

  const addressInputs: Inputs = [
    { name: "province", text: "Provinsi", data: address.province },
    { name: "city", text: "Kota/Kabupaten", data: address.city },
    { name: "district", text: "Kecamatan", data: address.district },
    { name: "ward", text: "Kelurahan", data: address.ward },
  ];

  console.log(form)
  
  return (
    <div className="container-penduduk">
      <h3>TAMBAH DATA</h3>
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
          <p className="w-[200px] inline-block">
            Jenis kelamin
          </p>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-3">
              <input onChange={(e)=>onChange(e)} defaultChecked id="male" value="Laki - laki" name="sex" type="radio"/>
              <label htmlFor="male">Laki - laki</label>
            </div>
            <div className="flex items-center space-x-3">
              <input onChange={(e)=>onChange(e)} id="female" value="Perempuan" name="sex" type="radio"/>
              <label htmlFor="female">Perempuan</label>
            </div>
          </div>
          <input
            // onChange={(e) => onChange(e)}
            // className="border w-1/2 px-px"
            // id={input.id}
            // name={input.id}
            // type={input.type}
          />
        </div>
        <div className="label-input flex items-center">
          <p className="w-[200px]">Alamat</p>
          <div className="flex space-x-6">
            {addressInputs.map((input, i) => (
              <select
                key={i}
                name={input.name}
                value={input.data.selected || "default"}
                onChange={(e) => changeOption(e)}
              >
                <option value="default" disabled>
                  {input.text}
                </option>
                {input.data.data.map((option) => (
                  <option key={option.id} value={`${option.id}-${option.nama}`}>
                    {option.nama}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <button type="submit" name="submit" className="bg-blue-400">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
