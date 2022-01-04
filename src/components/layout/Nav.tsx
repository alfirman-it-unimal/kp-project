import { useTypedSelector } from '@/config/redux'
import React from 'react'
import { NavLink } from '../NavLink'

export const Nav = () => {
    const { isLogin } = useTypedSelector(state => state.authReducer)
    return (
      <aside className='h-[calc(100vh-54px)]'>
        <nav>
          <ul>
            <li><NavLink link="/" activeClassname="active">Dashboard</NavLink></li>
            <li><NavLink link="/population" activeClassname="active">Data Penduduk</NavLink></li>
            <li><NavLink link="/add" activeClassname="active">Tambah Data</NavLink></li>
            {isLogin&&<li><NavLink link="/request" activeClassname="active">Permintaan Data</NavLink></li>}
          </ul>
        </nav>
      </aside>
    )
}
