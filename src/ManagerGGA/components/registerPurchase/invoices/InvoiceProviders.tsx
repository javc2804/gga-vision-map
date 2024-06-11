import React, { useState } from "react";
import { Grid, TextField, Autocomplete } from "@mui/material";
import { Controller, Control } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateEditPurchase } from "../../../../store/purchase/purchaseSlice";

interface Provider {
  id: string;
  name: string;
}

interface InvoiceProvidersProps {
  control: Control;
  providers: Provider[];
  setFormState: React.Dispatch<
    React.SetStateAction<{ facNDE: number; proveedor: Provider | null }>
  >;
}

export const InvoiceProviders: React.FC<InvoiceProvidersProps> = ({
  control,
  providers,
  setFormState,
}) => {
  const dispatch = useDispatch();
  const editPurchase = useSelector((state: any) => state.purchase.purchaseEdit);

  const [facNDE, setFacNDE] = useState<number>(
    Number(editPurchase.facNDE) || 0
  );

  const handleFacNDEChange = (e: any) => {
    setFacNDE(Number(e.target.value));

    if (Object.keys(editPurchase).length !== 0) {
      dispatch(
        updateEditPurchase({ ...editPurchase, facNDE: Number(e.target.value) })
      );
    }
  };

  const handleFacNDEBlur = () => {
    setFormState((prevState) => ({ ...prevState, facNDE: facNDE }));
  };

  const handleProviderChange = (field: any, _: any, value: any) => {
    field.onChange(value);
    setFormState((prevState) => ({ ...prevState, proveedor: value.name }));
    if (Object.keys(editPurchase).length !== 0) {
      dispatch(updateEditPurchase({ ...editPurchase, proveedor: value.name })); // Actualiza editPurchase
    }
  };

  return (
    <Grid container spacing={2} justifyContent="flex-end">
      <Grid item xs={2}>
        <TextField
          label="Fac NDE"
          variant="outlined"
          onChange={handleFacNDEChange}
          onBlur={handleFacNDEBlur}
          value={facNDE}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <Controller
          name="provider"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={providers}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ flexGrow: 0.15 }}
              onChange={(event, value) =>
                handleProviderChange(field, event, value)
              }
              value={
                field.value ||
                providers.find(
                  (provider) => provider.name === editPurchase.proveedor
                ) ||
                null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Registro Proveedor"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default InvoiceProviders;
