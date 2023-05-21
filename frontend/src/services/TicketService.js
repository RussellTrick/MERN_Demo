import axios, { axiosPrivate } from "../api/axios";
import { deleteTicketFromProject } from "./ProjectService";

export async function getTicketById(id) {
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

export function deleteTicket({ setErrMsg }, projectId, ticketId) {
  axiosPrivate
    .delete(`/tickets/${ticketId}`, { withCredentials: true })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        deleteTicketFromProject(projectId, ticketId);
      }
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}
