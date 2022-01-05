export default function status(stat: string) {
  switch (stat) {
    case "pending":
      return {
        text: "Menunggu konfirmasi",
        color: "text-gray-300",
        bgColor: "bg-gray-300",
      };
    case "waiting":
      return {
        text: "Dalam antrean",
        color: "text-blue-300",
        bgColor: "bg-blue-300",
      };
    case "onprogress":
      return {
        text: "Diproses",
        color: "text-yellow-300",
        bgColor: "bg-yellow-300",
      };
    case "success":
      return {
        text: "Sukses",
        color: "text-green-300",
        bgColor: "bg-green-300",
      };
    case "failed":
      return {
        text: "Gagal",
        color: "text-red-300",
        bgColor: "bg-red-300",
      };
    default:
      return {
        text: "Menunggu konfirmasi",
        color: "text-gray-300",
        bgColor: "bg-gray-300",
      };
  }
}
