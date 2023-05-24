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

export async function updateTicket({ setErrMsg }, ticketUpdateState) {
  if (!ticketUpdateState._id) {
    setErrMsg("Cannot update project: Ticket Id is missing");
    console.log("Cannot update project missing Is`");
    return;
  }

  const ticketId = ticketUpdateState._id;

  axiosPrivate
    .put(
      `/tickets/${ticketId}`,
      {
        Name: ticketUpdateState.Name,
        Description: ticketUpdateState.Description,
        Project: ticketUpdateState.Project,
        Status: ticketUpdateState.Status,
        Urgency: ticketUpdateState.Urgency,
      },
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
      setErrMsg(err);
    });
}

export async function countTicketUrgency({ setErrMsg }) {
  return axiosPrivate
    .get(`/tickets/count-urgency`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      setErrMsg(err);
    });
}

export async function countTicketStatus({ setErrMsg }) {
  return axiosPrivate
    .get(`/tickets/count-status`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      setErrMsg(err);
    });
}
