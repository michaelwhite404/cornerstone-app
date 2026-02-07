import { AxiosResponse } from "axios";

const downloadAxiosData = (response: AxiosResponse<any>, fileName: string) => {
  const href = URL.createObjectURL(response.data);

  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", fileName); //or any other extension
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
export default downloadAxiosData;
