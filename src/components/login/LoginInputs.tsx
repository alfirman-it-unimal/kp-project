import { Input } from "@/pages/Login";

interface LoginInputsProps {
  handleChange: Function;
  input: Input;
}

export default function LoginInputs({ handleChange, input }: LoginInputsProps) {
  return (
    <>
      <div className="space-y-1">
        <label
          htmlFor="username"
          className="text-gray-500 text-sm font-semibold"
        >
          Email
        </label>
        <input
          id="username"
          value={input.username}
          onChange={(e) => handleChange(e)}
          placeholder="Masukkan Email Anda"
          className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:outline-none shadow-sm"
        />
      </div>
      <div className="space-y-1 mt-4">
        <label
          htmlFor="password"
          className="text-gray-500 text-sm font-semibold"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={input.password}
          onChange={(e) => handleChange(e)}
          placeholder="Masukkan Password Anda"
          className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:outline-none shadow-sm"
        />
      </div>
    </>
  );
}
