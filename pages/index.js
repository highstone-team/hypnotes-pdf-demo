import dynamic from "next/dynamic";
import { useState } from "react";

const FormCreate = dynamic(
  import("hypnotes-pdf/dist").then((module) => module.FormCreate),
  { loading: () => <p>Loading...</p>, ssr: false }
);

const FormFill = dynamic(
  import("hypnotes-pdf/dist").then((module) => module.FormFill),
  { loading: () => <p>Loading...</p>, ssr: false }
);

export default function Home() {
  const [originPdfurl, setOriginPdfUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [step, setStep] = useState(1);
  const [formFields, setFormFields] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOriginPdfUrl(URL.createObjectURL(file));
      setPdfUrl(URL.createObjectURL(file));
    } else {
      setOriginPdfUrl(null);
      setPdfUrl(null);
    }
  };

  const handleFormCreateSave = async (formFieldsData, inputFieldsData) => {
    setFormFields(formFieldsData);
    let data = {};
    for (const index in inputFieldsData) {
      data[index] = inputFieldsData[index].data;
    }

    const response = await fetch(originPdfurl);
    const pdfBlob = await response.blob();
    const licenseKey = "rjDFL7RX@C03";

    const formData = new FormData();
    formData.append("file", pdfBlob, "demo.pdf");
    formData.append("formFields", JSON.stringify(inputFieldsData));
    formData.append("formFieldData", JSON.stringify(data));
    formData.append("licenseKey", licenseKey);
    const mergeResponse = await fetch(
      "https://pdf-api.hypnotes.net/api/merge-pdf",
      {
        method: "POST",
        body: formData,
      }
    );

    if (mergeResponse.ok) {
      const blob = await mergeResponse.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } else {
      const error = await mergeResponse.json();
      alert(`Error: ${error.message}`);
    }
  };

  const handleFormFillSave = async (formFields, formFieldData) => {
    const response = await fetch(pdfUrl);
    const pdfBlob = await response.blob();
    const licenseKey = "rjDFL7RX@C03";

    const formData = new FormData();
    formData.append("file", pdfBlob, "demo.pdf");
    formData.append("formFields", JSON.stringify(formFields));
    formData.append("formFieldData", JSON.stringify(formFieldData));
    formData.append("licenseKey", licenseKey);
    const mergeResponse = await fetch(
      "https://pdf-api.hypnotes.net/api/merge-pdf",
      {
        method: "POST",
        body: formData,
      }
    );

    if (mergeResponse.ok) {
      const blob = await mergeResponse.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } else {
      const error = await mergeResponse.json();
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ height: "90vh" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <input
          style={{ padding: 10 }}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
        {step == 1 && (
          <button
            style={{
              padding: "5px 10px",
              backgroundColor: "#B1FFCA",
              border: "none",
              borderRadius: "7px",
            }}
            onClick={() => setStep(2)}
          >
            Form Fill
          </button>
        )}
        {step == 2 && (
          <button
            style={{
              padding: "5px 10px",
              backgroundColor: "#B1FFCA",
              border: "none",
              borderRadius: "7px",
            }}
            onClick={() => setStep(1)}
          >
            Form Create
          </button>
        )}
      </div>
      {pdfUrl && (
        <>
          <div style={{ display: step === 1 ? "block" : "none" }}>
            <FormCreate
              prevFormFields={formFields}
              pdfUrl={originPdfurl}
              onSaveDocument={handleFormCreateSave}
            />
          </div>
          <div style={{ display: step === 2 ? "block" : "none" }}>
            <FormFill
              formFields={formFields}
              pdfUrl={pdfUrl}
              onSaveDocument={handleFormFillSave}
            />
          </div>
        </>
      )}
    </div>
  );
}
