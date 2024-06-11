import { useState } from "react";
import { TableRow, TableCell, Box } from "@mui/material";
import { IRow } from "../../view/expenses/ListPurchase";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editPurchase } from "../../../store/purchase/purchaseSlice";
import { DeleteDialog } from "../../../components/DeleteDialog";

type ActionButtonsProps = {
  id: IRow;
  handleDelete: (row: IRow) => void; // Cambiar el tipo de 'handleDelete' a '(row: IRow) => void'
};

type TableRowDataProps = {
  row: IRow;
  headers: string[];
};

const columnToDataKeyMap: { [key: string]: string } = {
  Acciones: "acciones",
};

const cursor = {
  cursor: "pointer",
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = (data: IRow) => {
    dispatch(editPurchase(data));
    navigate(`/register-out/`);
  };

  return (
    <Box>
      <EditIcon style={cursor} color="primary" onClick={() => handleEdit(id)} />{" "}
      <DeleteIcon
        style={cursor}
        color="error"
        onClick={() => handleDelete(id)}
      />
    </Box>
  );
};

export const TableRowData: React.FC<TableRowDataProps> = ({ row, headers }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IRow | null>(null);

  const handleDelete = (selectedRow: IRow) => {
    setSelectedRow(selectedRow);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = (row: IRow) => {
    if (row) {
      console.log(row.ID);
    }
    setOpen(false);
  };

  return (
    <>
      <TableRow key={row.ID}>
        {headers.map((header, index) => {
          const dataKey = columnToDataKeyMap[header] || header;
          return dataKey !== "acciones" ? (
            <TableCell key={`${row.ID}-${index}`}>
              {dataKey === "createdAt"
                ? new Date(row[dataKey]).toLocaleDateString("en-GB")
                : row[dataKey]}
            </TableCell>
          ) : (
            <TableCell key={`${row.ID}-actions`}>
              <ActionButtons id={row} handleDelete={() => handleDelete(row)} />
            </TableCell>
          );
        })}
      </TableRow>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={() => {
          if (selectedRow) {
            handleConfirm(selectedRow);
          }
        }}
      />
    </>
  );
};
