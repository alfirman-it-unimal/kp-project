const getAge = (birthDate: any) => Math.floor((new Date(Date.now()).getTime() - new Date(birthDate).getTime()) / 3.15576e10);

export default getAge;
