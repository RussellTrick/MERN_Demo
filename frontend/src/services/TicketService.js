import { axiosPrivate } from "../api/axios";

export async function getTicketsByProjectId(id) {
  return axiosPrivate
    .get(`/tickets/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}
