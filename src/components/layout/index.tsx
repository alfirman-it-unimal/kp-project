import { useTypedSelector } from "@/config/redux";
import { logout } from "@/config/redux/action";
import Link from "next/link";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import Loading from "../Loading";
import { Nav } from "./Nav";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isLoading } = useTypedSelector((state) => state.generalReducer);
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  return (
    <>
      {isLoading && <Loading />}
      <div className="h-screen">
        <header>
          <div className="head container">
            <h2>Sistem Informasi Pendaftaran Penduduk Online</h2>
            {!isLogin ? (
              <Link href="/login">
                <a className="bg-gray-400 px-2 rounded-sm">login</a>
              </Link>
            ) : (
              <button
                onClick={() => dispatch(logout())}
                className="bg-gray-400 text-white px-2 rounded-sm"
              >
                logout
              </button>
            )}
          </div>
        </header>
        <main className="flex h-[calc(100vh-54px)]">
          <Nav />
          <section className="min-h-[calc(100vh-54px)] overflow-auto">
            {children}
          </section>
        </main>
      </div>
    </>
  );
}
