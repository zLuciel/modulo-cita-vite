import * as React from "react";
import Box from "@mui/material/Box";
import { IoEyeSharp } from "react-icons/io5";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import esLocaleText from "./traductor"
// eslint-disable-next-line react/prop-types
export default function TablesCita({allUser}) {
  const [rows, setRows] = React.useState([]);
  const [message,setMessage] = React.useState(null)
  const [opened, { open, close }] = useDisclosure(false);
  const Navigate = useNavigate()


 
  React.useEffect(() => {
    if (allUser) {
      // eslint-disable-next-line react/prop-types
      const transformedRows = allUser.map((appointment,index) => ({
        idIndex:index,
        id: appointment.id,
        dni: appointment.reservedBy.documentNumber,
        firstName: appointment.reservedBy.firstName.toUpperCase(),
        apellido_paterno: appointment.reservedBy.apellido_paterno.toUpperCase(),
        apellido_materno: appointment.reservedBy.apellido_materno.toUpperCase(),
        mobileNumber: appointment.reservedBy.mobileNumber,
        email: appointment.reservedBy.email,
        appointmentDate: appointment.appointmentDate.split("T")[0].split("-").reverse().join("/"),
        sectionId: appointment.section.id,
        slug: appointment.section.sectionSlug,
        reservedById: appointment.reservedBy.id,
        sectionName: appointment.section.sectionName,
        timeCita: `${appointment.schedule.startTime} - ${appointment.schedule.endTime}`,
        message: appointment.message,
      }));
      setRows(transformedRows);
    }
  }, [allUser]);
 
  const handleReprogramarClick = (sectionId, reservedById,message) => () => {
    setMessage(message)
    open(); // Abre el modal
  };

  const handleInformationClick = (sectionId, reservedById,slug,email,id) => () => {
    Navigate(`/dashboard/revision/${slug}/${reservedById}?id=${sectionId}&email=${email}&idCita=${id}`,{
      state: { 
        id: sectionId,
        email,
        idCita:id, 
      },
    })
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Ver usuario",
      cellClassName: "actions",
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          key={id}
          icon={<IoEyeSharp size={20} />}
          label="Información"
          onClick={handleInformationClick(row.sectionId, row.reservedById,row.slug,row.email,row.id)}
        />,
      ],
    },
    {
      field: "reprogramar",
      type: "actions",
      headerName: "Reprogramar cita",
      cellClassName: "reprogramar",
      width: 200,
      getActions: ({ id, row,}) => [
        <Button
          disabled={row.message === null ? true : false }
          onClick={handleReprogramarClick(row.sectionId, row.reservedById,row.message)}
          key={id}
          variant="gradient"
          gradient={{ from: "red", to: "pink", deg: 90 }}
        >
          VER MENSAJE
        </Button>,
      ],
    },
    { field: "dni", headerName: "DNI", width: 150, editable: false },
    { field: "firstName", headerName: "Nombres", width: 150, editable: false },
    { field: "apellido_paterno", headerName: "Apellido Paterno", width: 150, editable: false },
    { field: "apellido_materno", headerName: "Apellido Materno", width: 150, editable: false },
    {
      field: "sectionName",
      headerName: "Sección de documento",
      width: 150,
      editable: false,
    },
    {
      field: "appointmentDate",
      headerName: "Fecha de Cita",
      width: 150,
      editable: false,
    },
    {
      field: "timeCita",
      headerName: "Horario de cita",
      width: 150,
      editable: false,
    },

    {
      field: "mobileNumber",
      headerName: "Teléfono",
      width: 150,
      editable: false,
    },
    { field: "email", headerName: "Gmail", width: 200, editable: false },
  ];

  return (
    <>
      <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
        <Modal opened={opened} onClose={close} title="Mensaje de reprogramación recibido" centered>
          {message}
        </Modal>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          editMode="row"
          localeText={esLocaleText} // Aplicar el idioma en español
          getRowId={(row) => row.idIndex}
          sx={{ minWidth: "100%", overflow: "hidden" }}
        />
      </Box>
    </>
  );
}
