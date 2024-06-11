import { useEffect, useRef, useState } from "react";
import { TextField, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../../../../helpers/validationsPaymentForm";
import { useCalculations } from "../../../../hooks/purchase/useCalculations";
import PaymentFieldsCompromise from "./PaymentFieldsCompromise";
import OrdersCompromise from "./OrdersCompromise";
import SparePartsAndDescriptionsCompromise from "./SparePartsAndDescriptionsCompromise";
import { useSelector } from "react-redux";

interface PaymentFormProps {
  initialValues: any;
  spareParts: any;
  sparePartVariants: any;
  onChange: any;
}

export const PaymentFormCompromise = ({
  initialValues,
  spareParts,
  sparePartVariants,
  onChange,
}: PaymentFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const editPurchase = useSelector((state: any) => state.purchase.purchaseEdit);

  const {
    calculatePrecioUnitarioUsd,
    calculateMontoTotalBs,
    calculateMontoTotalUsd,
    calculateTasaBcv,
  } = useCalculations();

  const [values, setValues] = useState(initialValues);

  const lastValuesRef = useRef(values);

  useEffect(() => {
    if (editPurchase && Object.keys(editPurchase).length !== 0) {
      Object.keys(editPurchase).forEach((key) => {
        setValue(key, editPurchase[key]);
      });
    }
  }, [editPurchase, setValue]);

  useEffect(() => {
    if (
      typeof onChange === "function" &&
      JSON.stringify(values) !== JSON.stringify(lastValuesRef.current)
    ) {
      onChange(values, errors);
      lastValuesRef.current = values;
    }
  }, [values, onChange, errors]);
  const onSubmit = (data: any) => {
    if (typeof onChange === "function") {
      onChange(data, errors);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <SparePartsAndDescriptionsCompromise
        control={control}
        setValues={setValues}
        values={values}
        spareParts={spareParts}
        sparePartVariants={sparePartVariants}
      />
      <Controller
        name="descripcion"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Descripción"
            variant="outlined"
            error={!!errors.descripcion}
            onChange={(event) => {
              field.onChange(event); // update field value
              trigger("descripcion"); // validate field
              setValues({ ...values, descripcion: event.target.value }); // update local state
            }}
          />
        )}
      />
      <PaymentFieldsCompromise
        control={control}
        errors={errors}
        trigger={trigger}
        values={values}
        setValues={setValues}
        setValue={setValue}
        calculateMontoTotalUsd={calculateMontoTotalUsd}
      />
      <OrdersCompromise
        control={control}
        errors={errors}
        values={values}
        setValues={setValues}
        trigger={trigger}
      />
    </Box>
  );
};

export default PaymentFormCompromise;
