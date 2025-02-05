
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import usePdfValidator from "@/hooks/usePdfValidator";
import { FaFilePdf } from "react-icons/fa6";
import { PDFDocument } from "pdf-lib";
import dataApi from "@/data/fetchData";
import { useProduct } from "@/provider/ProviderContext";
import { Link } from "react-router-dom";

const ButtonUpdate = ({
  setLoadingFile,
  matchingFile,
  fileName,
  idFiles,
  getfileName,
  sectionIdDocument,
  files,
  setEstadoOk,
  stateOk,
  idDocument,
  setCompletFileInput,
  setMemoryProcess,
  updateVery,
}) => {
  const url = `${import.meta.env.VITE_PUBLIC_URL}/files/pdf`;
  const { user } = useProduct();
  const { validatePdf } = usePdfValidator(10);

  const handleConverPostPdf = async (typeId, namePdf, idFileInput) => {
    setLoadingFile(true);
    if (files[namePdf].length === 0) return;

    const idFile = notifications.show({
      withCloseButton: true,
      autoClose: false,
      title: "Espere subiendo archivo",
      message: namePdf,
      color: "red",
      icon: <FaFilePdf />,
      className: "my-notification-class",
      loading: true,
    });

    const mergedPdf = await PDFDocument.create();

    for (const file of files[namePdf]) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const fileConvert = new File([blob], `${namePdf}.pdf` || "merged.pdf", {
      type: "application/pdf",
    });

    if (fileConvert.type === "application/pdf" && validatePdf(fileConvert)) {
      try {
        const veryupdateFile = updateVery ? "update" : "";
        const idCondition = updateVery ? updateVery.id : idFileInput;

        const res = await dataApi.postFileOne(
          user.token,
          fileConvert,
          typeId,
          veryupdateFile,
          idCondition
        );
        if(res.error){
          notifications.update({
            id: idFile,
            withCloseButton: true,
            autoClose: 3000,
            title: "Error pdf",
            message: res.message,
            color: "red",
            icon: <FaFilePdf />,
            className: "my-notification-class",
            loading: false,
          });
          return
        }
        // setFilePdf(res.fileUrl);

        if (res.fileUrl) {
          setEstadoOk({ ...stateOk, [namePdf]: true });
          notifications.update({
            id: idFile,
            withCloseButton: true,
            autoClose: 3000,
            title: "Archivo PDF subido",
            message: namePdf,
            color: "black",
            icon: <FaFilePdf />,
            className: "my-notification-class",
            style: { backgroundColor: "greenyellow" },
            loading: false,
          });
          // const res = await dataApi.getFilesUser(idDocument, user.token);

          const CompletFileInput = await dataApi.getCompletFilesInputs(
            user.token,
            idDocument
          );
          setMemoryProcess(CompletFileInput);
          setCompletFileInput(CompletFileInput);
        }
        return;
      } finally {
        setLoadingFile(false);
      }
    }

    if (!validatePdf(fileConvert)) {
      setLoadingFile(false);
      notifications.update({
        id: idFile,
        withCloseButton: true,
        autoClose: 3000,
        title: "Archivo demasiado pesado",
        message: "pdf debe ser menos de 10MB",
        color: "red",
        icon: <FaFilePdf />,
        className: "my-notification-class",
        loading: false,
      });
    }
  };

  return (
    <>
      {/* si hay documento muestra*/}

      {stateOk[getfileName] && (
        <div className="flex gap-2 self-start lg:self-end  md:self-end sm:self-end ">
          <Link
            className={"self-end"}
            target="_blank"
            to={`${url}/${matchingFile?.fileUrl}`}
          >
            <Button
              variant="gradient"
              gradient={{ from: "pink", to: "red", deg: 90 }}
            >
              <FaFilePdf />
            </Button>
          </Link>

          <Button
            className="self-end"
            variant="gradient"
            gradient={{ from: "lime", to: "green", deg: 90 }}
          >
            EXITOSO
          </Button>
        </div>
      )}

      {!stateOk[getfileName] && (
        <div className="flex gap-2 self-start lg:self-end  md:self-end sm:self-end ">
          <Button
            className="self-end"
            disabled={fileName === undefined || !fileName.length ? true : false}
            onClick={() =>
              handleConverPostPdf(sectionIdDocument, getfileName, idFiles)
            }
            variant="gradient"
            gradient={{ from: "blue", to: "violet", deg: 90 }}
          >
            ENVIAR DOCUMENTO
          </Button>
        </div>
      )}
    </>
  );
};

export default ButtonUpdate;