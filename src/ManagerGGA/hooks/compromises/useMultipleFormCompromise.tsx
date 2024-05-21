import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { startSaveCompromise } from "../../../store/purchase/purchaseThunks";

const useMultipleFormCompromise = (
  initialValuesPayment: any,
  openSnackbar: any,
  nde: any,
  proveedor: any,
  compromiso: any,
  ErrorOutline: any,
  CheckCircle: any
) => {
  const dispatch = useDispatch();

  const [forms, setForms] = useState([
    {
      id: 0,
      payment: initialValuesPayment,
      errors: {},
    },
  ]);
  const [nextId, setNextId] = useState(1);
  const [totalFactUsd, setTotalFactUsd] = useState(0); // Agregado

  const handleAddClick = () => {
    setForms([
      ...forms,
      {
        id: nextId,
        payment: initialValuesPayment,
        errors: {},
      },
    ]);
    setNextId(nextId + 1);
  };

  const handleRemoveClick = (id: any) => {
    const list = forms.filter((form) => form.id !== id);
    setForms(list);
  };

  const handleInputChange = useCallback(
    (id: any) => (newValues: any, newErrors: any) => {
      setForms((prevForms) =>
        prevForms.map((form) =>
          form.id === id
            ? { ...form, input: newValues, errors: newErrors }
            : form
        )
      );
    },
    [setForms]
  );

  const handlePaymentChange = useCallback(
    (id: any) => (newValues: any, newErrors: any) => {
      setForms((prevForms) => {
        let totalUsd = 0;
        let totalBs = 0;

        const newForms = prevForms.map((form) => {
          if (form.id === id) {
            totalUsd += parseFloat(newValues.montoTotalUsd);
            totalBs += parseFloat(newValues.montoTotalBs);
            return { ...form, payment: newValues, errors: newErrors };
          } else {
            totalUsd += parseFloat(form.payment.montoTotalUsd);
            totalBs += parseFloat(form.payment.montoTotalBs);
            return form;
          }
        });

        setTotalFactUsd(totalUsd);

        return newForms;
      });
    },
    [setForms]
  );

  const handleSaveClick = async () => {
    const userEmail = localStorage.getItem("email");
    const combinedForms = forms.map((form) => {
      form.payment.nde = nde;
      form.payment.proveedor = proveedor;
      form.payment.compromiso = compromiso;

      return {
        id: form.id,
        ...form.payment,
        user_rel: userEmail,
        errors: form.errors,
      };
    });

    let errorField = null;
    const hasErrors = forms.some((form) => {
      console.log(form);
      const requiredFields = [
        "nde",
        "compromiso",
        "proveedor",
        "cantidad",
        "montoTotalUsd",
        "numeroOrdenPago",
        "precioUnitarioUsd",
        "repuesto",
        "descripcionRepuesto",
        "fechaOcOs",
      ];

      return requiredFields.some((field) => {
        const hasError = !form.payment[field] || form.payment[field] === null;
        if (hasError) {
          errorField = field;
        }
        return hasError;
      });
    });

    if (hasErrors) {
      openSnackbar(
        `Error al guardar, verifica el campo ${errorField}`,
        "error",
        ErrorOutline
      );
      return;
    }

    if (nde === "0" || "") {
      openSnackbar(
        `Error al guardar, NDE debe estar lleno y distinto a 0`,
        "error",
        ErrorOutline
      );
      return;
    }

    const result = await dispatch(startSaveCompromise(combinedForms));
    if (result.ok) {
      openSnackbar("Guardado exitosamente", "success", CheckCircle);
    } else {
      openSnackbar(
        `Error al guardar: ${result.response}`,
        "error",
        ErrorOutline
      );
    }
  };

  return {
    forms,
    handleAddClick,
    handleRemoveClick,
    handleInputChange,
    handlePaymentChange,
    totalFactUsd,
    setTotalFactUsd,
    handleSaveClick,
  };
};

export default useMultipleFormCompromise;
