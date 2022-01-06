import { useTypedSelector } from "@/config/redux";
import React from "react";
import { NavLink } from "../NavLink";

export const Nav = () => {
  const { isLogin } = useTypedSelector((state) => state.authReducer);
  return (
    <aside className="h-[calc(100vh-54px)]">
      <nav>
        <ul>
          <li>
            <NavLink link="/" activeClassname="active">
              Dashboard
            </NavLink>
          </li>
          {!isLogin ? (
            <>
              <li>
                <NavLink link="/requirement" activeClassname="active">
                  Syarat
                </NavLink>
              </li>
              <li>
                <NavLink link="/register" activeClassname="active">
                  Registrasi
                </NavLink>
              </li>
              <li>
                <NavLink link="/check" activeClassname="active">
                  Cek Status
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink link="/resident" activeClassname="active">
                Data Penduduk
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};
