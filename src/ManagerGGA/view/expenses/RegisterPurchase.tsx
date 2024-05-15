import React, { useState } from "react";
import InputForm from "../../components/UTInputForm";
import PaymentForm from "../../components/PaymentForm";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
});

export const RegisterPurchase = () => {
  const initialValuesInput = {
    ut: "",
    marca: "",
    modelo: "",
    eje: "",
    subeje: "",
  };

  const initialValuesPayment = {
    repuesto: null,
    descripcionRepuesto: null,
    formaPago: "Contado",
    descripcion: "",
    cantidad: "",
    precioUnitarioBs: "",
    tasaBcv: "",
    precioUnitarioUsd: "",
    montoTotalUsd: "",
    montoTotalBs: "",
    ocOs: "",
    fechaOcOs: null,
    numeroOrdenPago: "",
    observacion: "",
    facNDE: "",
  };

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [nextId, setNextId] = useState(1);
  const [forms, setForms] = useState([
    {
      id: 0,
      input: initialValuesInput,
      payment: initialValuesPayment,
      errors: {},
    },
  ]);

  const handleAddClick = () => {
    setForms([
      ...forms,
      {
        id: nextId,
        input: initialValuesInput,
        payment: initialValuesPayment,
        errors: {},
      },
    ]);
    setNextId(nextId + 1);
  };

  const handleRemoveClick = (id) => {
    const list = forms.filter((form) => form.id !== id);
    setForms(list);
  };
  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpen(true);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSaveClick = () => {
    const combinedForms = forms.map((form) => {
      // Asegúrate de que el campo 'precioUnitarioBs' no esté vacío
      if (!form.payment.precioUnitarioBs) {
        form.errors.precioUnitarioBs = "El campo precio no puede estar vacío";
      }

      return {
        id: form.id,
        ...form.input,
        ...form.payment,
        errors: form.errors,
      };
    });

    const hasErrors = combinedForms.some((form) => {
      return form.errors && Object.keys(form.errors).length > 0;
    });

    if (hasErrors) {
      handleSnackbarOpen("Error al guardar, verifica el formulario", "error");
      return;
    }

    console.log(combinedForms);

    handleSnackbarOpen("Guardado con éxito", "success");
  };

  const handleInputChange = (id) => (newValues, newErrors) => {
    const newForms = forms.map((form) =>
      form.id === id ? { ...form, input: newValues, errors: newErrors } : form
    );
    setForms(newForms);
  };

  const handlePaymentChange = (id) => (newValues, newErrors) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? { ...form, payment: newValues, errors: newErrors }
          : form
      )
    );
  };

  return (
    <>
      {forms.map((form) => (
        <div key={form.id}>
          <InputForm
            initialValues={form.input}
            disabled={false}
            onChange={handleInputChange(form.id)}
          />
          <PaymentForm
            initialValues={form.payment}
            onChange={handlePaymentChange(form.id)}
          />
          {forms.length > 1 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRemoveClick(form.id)}
            >
              Borrar
            </Button>
          )}
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Agregar
      </Button>
      <Button variant="contained" color="success" onClick={handleSaveClick}>
        Guardar
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterPurchase;
