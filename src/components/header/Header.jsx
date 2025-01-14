import { Box, Divider, NavLink } from "@mantine/core";
import { RiFolderUserFill } from "react-icons/ri";
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa6";

import { useSelector } from "react-redux";
import Logout from "../buttons/Logout";
import { Link, useLocation } from "react-router-dom";
import logoSjl from "@/assets/logo2.png";
const data2 = [
  {
    icon: RiFolderUserFill,
    label: "INSCRIPCIÓN DE INDEPENDIZACIÓN",
    description: "Formaliza la independencia de tu propiedad.",
    link: "/tramite/documento/inscripcion-de-independizacion",
  },
  {
    icon: FaHouseUser,
    label: "INSCRIPCIÓN DE SUBDIVISIÓN DE LOTES",
    description: "Registra la subdivisión de tus lotes.",
    link: "/tramite/documento/inscripcion-de-subdivision-de-lotes",
  },
  {
    icon: MdOutlineFamilyRestroom,
    label: "SUCESIÓN INTESTADA",
    description: "Regulariza la herencia de bienes familiares.",
    link: "/tramite/documento/sucesion-intestada",
  },
];


const Header = ({ close }) => {
  const location = useLocation();
  const { allDocumets } = useSelector((state) => state.DocumentsGlobalRedux);
  const arrayPhatname = location.pathname.split("/");

  const slug = arrayPhatname[arrayPhatname.length - 1];
  const documentNew = allDocumets.map((data, index) => ({
    ...data,
    ...(data2[index] || {}),
  }));

  const tramite = documentNew.map((item, index) => (
    <Link to={item.link} key={index}>
      <NavLink
        onClick={close}
        key={item.sectionId}
        active={item.sectionSlug == slug && arrayPhatname[2] === "documento"}
        label={item.sectionName}
        description={item.description}
        leftSection={<item.icon size="1rem" stroke={1.5} />}
        color="#F1A405"
        variant="filled"
      />
    </Link>
  ));

  const follows = documentNew.map((item) => {
    return (
      <Link
        to={`/tramite/documento-seguimiento/${item.sectionSlug}?id=${item.sectionId}`}
        key={item.sectionId}
      >
        <NavLink
          key={item.sectionId}
          active={
            `${item.sectionSlug}` === slug &&
            arrayPhatname[2] === "documento-seguimiento"
          }
          onClick={() => close()}
          label={item.sectionName}
          description={item.description}
          leftSection={<item.icon size="1rem" stroke={1.5} />}
          color="#F1A405"
          variant="filled"
        />
      </Link>
    );
  });

  return (
    <div className="w-full flex  gap-0 flex-col justify-between  items-center  py-4 header-bg-image">
      <div className="w-full flex flex-col items-center  gap-4">
        <img
          className="logo-header"
          src={logoSjl}
          alt="san juan de lurigancho citas"
        />
        <h1 className="text-center text-[1.4rem] font-semibold">
          ¿Qué trámite desea realizar?
        </h1>
        {/* auto scroll */}
        <div className="header-auto-scroll">
        <Divider my="xs" label="TRAMITES" labelPosition="center" />
          <Box className="text-white-css" w={320}>
            {tramite}
          </Box>
          {/* seguimiento */}

          <div>
            <Divider my="xs" label="SEGUIMIENTO" labelPosition="center" />
            <Box w={320}>{follows}</Box>
          </div>
        </div>
      </div>
      <div className="w-full px-5">
        <Logout />
      </div>
    </div>
  );
};

export default Header;
