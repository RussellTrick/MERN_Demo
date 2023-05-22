import { axiosPrivate } from "../api/axios";
import { deleteTicketFromProject, addTicketToProject } from "./ProjectService";

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
      if (res.status === 200) {
        deleteTicketFromProject(projectId, ticketId);
      }
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}

export async function createTicket({ setErrMsg }, data) {
  try {
    const res = await axiosPrivate.post("/tickets/", {
      Name: data.Name,
      Description: data.Description,
      Project: data.Project,
      Status: data.Status,
      Urgency: data.Urgency,
    });

    if (res.status === 201) {
      await addTicketToProject(data.Project, res.data._id);
    }
  } catch (err) {
    console.log(err);
    setErrMsg(err);
  }
}
