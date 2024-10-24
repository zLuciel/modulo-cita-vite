import Movil from "@/components/header/Movil";
import { useEffect, useState } from "react";
import IntestadaDocument from "@/dashboard/components/ficheros/IntestadaDocument";
import { useProduct } from "@/provider/ProviderContext";
import dataApi from "@/data/fetchData";

import { Button } from "@mantine/core";
import { MdOutgoingMail } from "react-icons/md";
import { notifications } from "@mantine/notifications";
import FileSkeleton from "@/components/skeleton/FileSkeleton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const RevisionPage = () => {
  const navigate = useNavigate();
  const { user, documentUser, setDocumentUser } = useProduct();
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const {id: idUserParams } = useParams();
  const idSection = searchParams.get("id");
  const emailUser = searchParams.get("email");

  useEffect(() => {
    async function getDocumentUser() {
      try {
        const data = await dataApi.getUserDocumentSection(
          user.token,
          idSection,
          idUserParams
        );

        setDocumentUser(data);
      } finally {
        setLoading(false);
      }
    }
    if (user.token) getDocumentUser();
  }, [idSection, idUserParams, setDocumentUser, user.token]);

  const handleFormularioEmail = async () => {
    notifications.show({
      id: 40,
      withCloseButton: true,
      autoClose: false,
      title: "Enviando",
      message: "",
      color: "green",
      className: "",
      loading: true,
    });

    const sendEmail = await dataApi.sendEmailUser(user.token, emailUser);

    if (sendEmail.data.emailSent) {
      const resetHisory = await dataApi.deleteHisoryUser(
        user.token,
        idSection,
        idUserParams
      );

      notifications.update({
        id: 40,
        withCloseButton: true,
        autoClose: 3000,
        title: `Encuesta enviada correctamente`,
        message: "",
        color: "green",
        className: "",
        loading: false,
      });
      navigate(-1);
    }
  };

  return (
    <>
      <div className="">
        {<Movil role={"super user"} />}

        <main className="bg-white p-10 flex flex-col gap-4">
          {loading && <FileSkeleton />}
          {!loading && (
            <div>
              <h1 className="text-2xl font-bold mb-3">
                DOCUMENTOS {documentUser[0]?.section.sectionName}{" "}
              </h1>
              <span className="flex gap-2 mb-3">
                <h3 className="uppercasse font-bold text-[blue] ">
                  Nombre de usuario:
                </h3>
                <p className="font-semibold uppercase">
                  {documentUser[0]?.user.firstName}{" "}
                  {documentUser[0]?.user.apellido_paterno}{" "}
                  {documentUser[0]?.user.apellido_materno}
                </p>
              </span>

              <IntestadaDocument
                setRefresh={setRefresh}
                paramsID={idUserParams}
                documentUser={documentUser}
                idSection={idSection}
                token={user.token}
                email={emailUser}
              />
              <div className="flex items-center justify-center">
                <Button
                  className="mt-4"
                  onClick={handleFormularioEmail}
                  rightSection={<MdOutgoingMail size={24} />}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "violet", deg: 90 }}
                >
                  ENVIAR ENCUESTA
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};
export default RevisionPage;
