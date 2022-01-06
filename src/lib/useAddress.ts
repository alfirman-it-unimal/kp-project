import { ChangeEvent, useCallback, useEffect, useState } from "react";

export interface AddressData {
  data: { id: number; nama: string }[];
  selected: {
    id: number;
    name: string;
  };
}

interface Address {
  provinsi: AddressData;
  kota: AddressData;
  kecamatan: AddressData;
  kelurahan: AddressData;
}

type Name = "provinsi" | "kota" | "kecamatan" | "kelurahan";

export default function useAddress() {
  const [address, setAddress] = useState<Address>({
    provinsi: { data: [], selected: { id: 0, name: "" } },
    kota: { data: [], selected: { id: 0, name: "" } },
    kecamatan: { data: [], selected: { id: 0, name: "" } },
    kelurahan: { data: [], selected: { id: 0, name: "" } },
  });

  const fetchAddress = (name: Name, queryId: string) => {
    let responseName = "";
    if (name === "kota") responseName = "kota_kabupaten";
    else responseName = name;

    fetch(`https://dev.farizdotid.com/api/daerahindonesia/${name}${queryId}`)
      .then((res) => res.json())
      .then((data) => {
        setAddress((address: Address) => ({
          ...address,
          [name]: { ...address[name], data: data[responseName] },
        }));
      })
      .catch((error) => console.log(error));
  };

  const getProvinces = useCallback(() => {
    fetch("https://dev.farizdotid.com/api/daerahindonesia/provinsi")
      .then((res) => res.json())
      .then((data) =>
        setAddress((address: Address) => ({
          ...address,
          provinsi: { ...address.provinsi, data: data.provinsi },
        }))
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  const changeOption = (e: ChangeEvent<HTMLSelectElement>, name: Name) => {
    const target = address[name].data.find(
      (el) => el.id === parseInt(e.target.value)
    );

    if (!target) return alert("data not found");

    if (name === "provinsi") {
      fetchAddress("kota", `?id_provinsi=${target?.id}`);
      address.kecamatan = { data: [], selected: { id: 0, name: "" } };
      address.kelurahan = { data: [], selected: { id: 0, name: "" } };
    }

    if (name === "kota") {
      fetchAddress("kecamatan", `?id_kota=${target?.id}`);
      address.kelurahan = { data: [], selected: { id: 0, name: "" } };
    }

    if (name === "kecamatan") {
      fetchAddress("kelurahan", `?id_kecamatan=${target?.id}`);
    }

    setAddress({
      ...address,
      [name]: {
        ...address[name],
        selected: { id: target?.id, name: target?.nama, query: "" },
      },
    });
  };

  return { address, changeOption };
}
