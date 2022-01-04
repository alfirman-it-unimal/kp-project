import { ChangeEvent, useCallback, useEffect, useState } from "react";

interface Data {
  data: { id: number; nama: string }[];
  selected: string;
}

interface Address {
  province: Data;
  city: Data;
  district: Data;
  ward: Data;
}

export default function useAddress() {
  const [address, setAddress] = useState<Address | any>({
    province: { data: [], selected: "" },
    city: { data: [], selected: "" },
    district: { data: [], selected: "" },
    ward: { data: [], selected: "" },
  });

  const getProvinces = useCallback(() => {
    fetch("https://dev.farizdotid.com/api/daerahindonesia/provinsi")
      .then((res) => res.json())
      .then((data) =>
        setAddress({
          ...address,
          province: { ...address.province, data: data.provinsi },
        })
      )
      .catch((error) => console.log(error));
  }, []);

  const getCities = useCallback(
    (id: number) => {
      fetch(
        "https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=" + id
      )
        .then((res) => res.json())
        .then((data) =>
          setAddress({
            ...address,
            city: { ...address.city, data: data.kota_kabupaten },
          })
        )
        .catch((error) => console.log(error));
    },
    [address.province]
  );
  const getDistrics = useCallback(
    (id: number) => {
      fetch(
        "https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=" + id
      )
        .then((res) => res.json())
        .then((data) =>
          setAddress({
            ...address,
            district: { ...address.district, data: data.kecamatan },
          })
        )
        .catch((error) => console.log(error));
    },
    [address.city]
  );

  const getWards = useCallback(
    (id: number) => {
      fetch(
        "https://dev.farizdotid.com/api/daerahindonesia/kelurahan?id_kecamatan=" +
          id
      )
        .then((res) => res.json())
        .then((data) =>
          setAddress({
            ...address,
            ward: { ...address.ward, data: data.kelurahan },
          })
        )
        .catch((error) => console.log(error));
    },
    [address.district]
  );

  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  useEffect(() => {
    !!address.province.selected &&
      getCities(parseInt(address.province.selected.split("-")[0]));
  }, [getCities, address.province.selected]);

  useEffect(() => {
    !!address.city.selected &&
      getDistrics(parseInt(address.city.selected.split("-")[0]));
  }, [getCities, address.city.selected]);

  useEffect(() => {
    !!address.district.selected &&
      getWards(parseInt(address.district.selected.split("-")[0]));
  }, [getCities, address.district.selected]);

  const changeOption = (e: ChangeEvent<HTMLSelectElement>) => {
    setAddress({
      ...address,
      [e.target.name]: {
        ...address[e.target.name],
        selected: e.target.value,
      },
    });
  };
  
  return { address, changeOption };
}
