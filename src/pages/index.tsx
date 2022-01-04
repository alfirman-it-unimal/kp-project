import { Card } from "@/components/home/Card";
import { firebaseReadData } from "@/config/firebase";
import getAge from "@/utils/getAge";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [classification, setClassification] = useState({
    kids: 0,
    teens: 0,
    adults: 0,
    elderlies: 0,
    male: 0,
    female: 0,
  });

  useEffect(() => {
    firebaseReadData("population").then((data: any) => {
      let temp = {
        kids: 0,
        teens: 0,
        adults: 0,
        elderlies: 0,
        male: 0,
        female: 0,
      };
      data.forEach((el: any) => {
        // age
        let age = getAge(new Date(el.date).toLocaleDateString());
        if (age < 18) temp.kids = temp.kids + 1;
        else if (age < 30) temp.teens = temp.teens + 1;
        else if (age < 50) temp.adults = temp.adults + 1;
        else if (age > 50) temp.elderlies = temp.elderlies + 1;

        // sex
        if (el.sex === "Laki - laki") temp.male = temp.male + 1;
        if (el.sex === "Perempuan") temp.male = temp.male + 1;
      });
      setClassification(temp);
    });
  }, []);

  const age = [
    { text: "ANAK - ANAK", value: classification.kids, icon: "fa-child" },
    { text: "REMAJA", value: classification.teens, icon: "fa-user-graduate" },
    { text: "DEWASA", value: classification.adults, icon: "fa-user-tie" },
    { text: "LANSIA", value: classification.elderlies, icon: "fa-wheelchair" },
  ];

  const sex = [
    { text: "LAKI - LAKI", value: classification.male, icon: "fa-male" },
    { text: "PEREMPUAN", value: classification.female, icon: "fa-female" },
  ];

  return (
    <div className="container-card-category">
      <Card color="blue" title="JUMLAH WARGA BERDASARKAN USIA" data={age} />
      <Card
        color="brown"
        title="JUMLAH WARGA BERDASARKAN JENIS KELAMIN"
        data={sex}
      />
    </div>
  );
};

export default Home;
