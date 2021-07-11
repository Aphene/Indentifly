// PaymentHistory
import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";


import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@material-ui/data-grid';


const styles = theme => ({
  spacer:{
      color:'red'
  }
});

const editJob= (id) =>    {
  global.currentJob=global.jobTable[id];
  global.gotoPage("Train");
}

const columns = [
    { field: 'ID', headerName: 'ID', width: 90 },
    {
      field: 'Amount',
      headerName: 'Amount',
      width: 150,
      editable: true,
    },
    {
      field: 'PaymentDate',
      headerName: 'Payment Date',
      width: 150,
      editable: true,
    },
    {
      field: 'JobID',
      headerName: 'Job',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.getValue(params.id, 'PaymentDate') || ''} ${
          params.getValue(params.id, 'RequesterID') || ''
        }`,
    },
  ];

const PaymentHistory = forwardRef((props, ref) => {

    const divRef = useRef(null)


    if (global.jobs===undefined || global.jubs===null) global.jobs=[];

    global.jobTable={};
    for(let i=0;i<global.jobs.length;++i) {
      global.jobTable[global.jobs[i].ID]=global.jobs[i];
    }

    let rows = global.payHistory;

    return (
        <box textAlign='center'>
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
            />
            </div>
        <p></p>
        <Button  variant="contained" color="primary" onClick={() => {global.gotoPage('Dashboard')}}> Return </Button>
        </box>
    )
});

export default PaymentHistory

