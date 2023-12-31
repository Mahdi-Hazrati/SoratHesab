import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { invoices_data, cities, invoice_types_list, transport_list } from './SampleData';
// import icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BorderColorIcon from '@mui/icons-material/BorderColor';
// work with pdf
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Main Grid Component
const DataGrid = () => {
  const [validationErrors, setValidationErrors] = useState({});
  

  // Columns are show in table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'invoice_number',
        header: 'شناسه فاکتور',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'invoice_date',
        header: 'تاریخ فاکتور'
      },
      {
        accessorKey: 'customer_name',
        header: "نام مشتری",
      },
      {
        accessorKey: 'invoice_amount',
        header: 'مبلغ فاکتور',
      },
      {
        accessorKey: 'invoice_type',
        header: 'نوع فاکتور',
        editVariant: 'select',
        editSelectOptions: invoice_types_list,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
      {
        accessorKey: 'transportation',
        header: 'نحوه پرداخت',
        editVariant: 'select',
        editSelectOptions: transport_list,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
      {
        accessorKey: 'address',
        header: 'آدرس',
        editVariant: 'select',
        editSelectOptions: cities,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    usePostApi();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetApi();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    usePutApi();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteApi();

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

// handle save pdf 
const handleExportRows = (rows) => {
  const doc = new jsPDF('p', 'pt', 'a4', true); // Specify 'utf8' encoding
  doc.setFont('Arial'); // Set the font for Persian text

  const tableData = rows.map((row) => Object.values(row.original));
  const tableHeaders = columns.map((c) => c.header);

  doc.autoTable({
    head: [tableHeaders],
    body: tableData,
    columnStyles: {
      0: { font: 'Arial', fontStyle: 'bold' }, // Customize styling of specific columns
    },
    languages: 'fa', // Set the language to Persian (fa)
  });

  doc.save('sorathesab.pdf');
};

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm(`مطمئن هستید میخواهید کاربر ${row.original.customer_name} را از دیتابیس حذف کنید؟`)) {
      deleteUser(row.original.invoice_number);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,

    getRowId: (row) => row.invoice_number,
    enableRowSelection: true,

    muiTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: { cursor: 'pointer' },
    }),
    
    enableSelectAll: false,
    positionToolbarAlertBanner: "none",
    enableMultiRowSelection: false,
    positionActionsColumn: 'last',
    enableRowActions: false,

    initialState: {
      showGlobalFilter: true, //show the global filter by default
    },
    muiSearchTextFieldProps: {
      placeholder: 'جستجو',
      sx: { minWidth: '200px' },
      variant: 'standard',
    },

    muiSkeletonProps: {
      animation: 'wave',
    },
    muiLinearProgressProps: {
      color: 'primary',
    },
    muiCircularProgressProps: {
      color: 'primary',
    },

    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
        color: 'error',
        children: 'خطا در بارگذاری دیتا',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '350px',
        height: "300px"
      },
    },

    muiPaginationProps:{
      rowsPerPageOptions: ['5', '10', '20', '50', '100'],
      showFirstButton: false,
      showLastButton: false,
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">ساخت کاربر جدید</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">ویرایش کاربر</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <div className="w-fit">
        <Button
          sx={{scale: "0.8" }}
          variant="text"
          color="warning"
          onClick={() => {
            // Edit Selected ROw
            const selectedRows = table.getSelectedRowModel().rows; //or read entire rows
            if(selectedRows[0]){
              table.setEditingRow(selectedRows[0])

            }else{
              window.alert("لطفا یک ردیف را انتخاب کنید سپس اقدام به ویرایش کنید.")
            }

          }}
        >
          <BorderColorIcon />
        </Button>

        <Button
          sx={{scale: "0.8" }}
          variant="text"
          color="error"
          onClick={() => {
            // Delete Selected ROW
            const selectedRows = table.getSelectedRowModel().rows; //or read entire rows
            if(selectedRows[0]){
              openDeleteConfirmModal(selectedRows[0])

            }else{
              window.alert("لطفا یک ردیف را انتخاب کنید سپس اقدام به حذف کنید.")
            }

          }}
        >
          <DeleteIcon />
        </Button>
        <Button
          sx={{scale: "0.9" }}
          variant="text"
          color='success'
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          <AddIcon />
        </Button>
        <Button
          sx={{scale: "0.8" }}
          variant="text"
          color="error"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
        >
          <PictureAsPdfIcon />
        </Button>
      </div>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function usePostApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoice) => {
      //send api update request here
      console.log(invoice)
      const response = await axios.post("http://localhost:3001/api", invoice)
      console.log("POST Request", response)
      return Promise.resolve(invoice);
    },
    //client side optimistic update
    onMutate: (newInvoices) => {
      queryClient.setQueryData(['invoices'], (prevInvoices) => [
        ...prevInvoices,
        {
          ...newInvoices,
          invoice_number: (Math.random() + 1).toString(36).substring(4),
        },
      ]);
    },
  });
}

//READ hook (get request from api)
function useGetApi() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      //send api request here
      const response = await axios.get('http://localhost:3001/api');
      return Promise.resolve(response.data);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function usePutApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoice) => {
      //send api update request here
      const id = invoice.invoice_number
      const response = await axios.put(`http://localhost:3001/api/${id}`, invoice)
      console.log("You are try to update", invoice)
      return Promise.resolve(invoice);
    },
    //client side optimistic update
    onMutate: (newnewInvoice) => {
      queryClient.setQueryData(['invoices'], (prevInvoices) =>
        prevInvoices?.map((prevInvoice) =>
          prevInvoice.invoice_number === newnewInvoice.invoice_number ? newnewInvoice : prevInvoice,
        ),
      );
    },
  });
}

//DELETE hook (delete user in api)
function useDeleteApi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoiceId) => {
      //send api update request here
      const response = await axios.delete(`http://localhost:3001/api/${invoiceId}`)
      console.log("You want to delete ", invoiceId)
      return Promise.resolve(invoiceId);
    },
    //client side optimistic update
    onMutate: (invoice_id) => {
      queryClient.setQueryData(['invoices'], (prevInvoices) =>
        prevInvoices?.filter((invoice) => invoice.invoice_number !== invoice_id),
      );
    },
  });
}

const queryClient = new QueryClient();

const DataGridWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <DataGrid />
  </QueryClientProvider>
);

export default DataGridWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user) {
  return {
    customer_name: !validateRequired(user.customer_name)
      ? 'وارد کردن نام اجباری است.'
      : ''
  };
}
