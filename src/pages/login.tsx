import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import LoginInputs from "@/components/login/LoginInputs";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useDispatch } from "react-redux";
import { login } from "@/config/redux/action";
import { useTypedSelector } from "@/config/redux";

export interface Input {
  username: string;
  password: string;
}

const Login: NextPage = () => {
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useTypedSelector((state) => state.generalReducer);
  const { isLogin } = useTypedSelector((state) => state.authReducer);

  const [input, setInput] = useState<Input>({
    username: "admin@admin.com",
    password: "111111",
  });

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      login(input.username, input.password, () => alert("sukses login"))
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (isLogin) replace("/");
  }, [isLogin]);

  useEffect(() => {
    return () =>
      setInput({
        username: "admin@admin.com",
        password: "111111",
      });
  }, []);

  return (
    <main className="flex justify-center items-center h-[calc(100vh-154px)]">
      <div className="w-[500px] bg-white p-10 rounded shadow-lg">
        <h4 className="text-center font-bold text-2xl text-gray-700">
          Silahkan masuk ke akun anda
        </h4>
        <form onSubmit={(e) => submit(e)} className="mt-10">
          <LoginInputs handleChange={handleChange} input={input} />
          {!isLoading && (
            <button
              type="submit"
              className="bg-blue-400 text-white w-full my-4 py-2 rounded"
            >
              Masuk
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default Login;
