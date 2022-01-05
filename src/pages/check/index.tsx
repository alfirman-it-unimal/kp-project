import { firebaseReadData } from "@/config/firebase";
import { useTypedSelector } from "@/config/redux";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

const Check: NextPage = () => {
  const [form, setForm] = useState({ email: "", nik: "" });
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const { push, replace } = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const data: any = await firebaseReadData("resident");
    const targetIndex = data.findIndex((el: any) => el.nik === form.nik);
    if (targetIndex === -1) return alert("NIK tidak ditemukan");
    if (data[targetIndex].email !== form.email)
      return alert("NIK dan Email tidak cocok!");
    push(`/check/${data[targetIndex].id}`);
  };

  useEffect(() => {
    if (isLogin) replace("/");
  }, [isLogin, replace]);

  return (
    <div className="container-penduduk">
      <h3>CEK STATUS</h3>
      <form
        onSubmit={(e) => submit(e)}
        className="p-10 w-1/2 mx-auto space-y-3"
      >
        <input
          name="nik"
          value={form.nik}
          onChange={(e) => setForm({ ...form, nik: e.target.value })}
          className="block border rounded w-full py-2 px-3"
          type="number"
          placeholder="Masukkan NIK"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="block border rounded w-full py-2 px-3"
          type="email"
          placeholder="Masukkan Email"
        />
        <button className="w-full">Cek</button>
      </form>
    </div>
  );
};

export default Check;
