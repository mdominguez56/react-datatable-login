import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const columns= [
  { title: 'Id', field: 'id' },
  { title: 'BandID', field: 'bandId' },
  { title: 'Name', field: 'name' },
  { title: 'Year', field: 'year', type: 'numeric'}
];
const baseUrl="https://my-json-server.typicode.com/improvein/dev-challenge/albums";
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));
function TableData() {
  const styles= useStyles();
  const [data, setData]= useState([]);
  const [modalInsert, setModalInsert]= useState(false);
  const [modalEdit, setModalEdit]= useState(false);
  const [modalDelete, setModalDelete]= useState(false);
  const [albumSelect, setAlbumSelect]=useState({
    id: "",
    bandID: "",
    name: "",
    year: ""
  })
  const handleChange=e=>{
    const {id, value}=e.target;
    setAlbumSelect(prevState=>({
      ...prevState,
      [id]: value
    }));
  }
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
     setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPost=async()=>{
    await axios.post(baseUrl, albumSelect)
    .then(response=>{
      setData(data.concat(response.data));
      openCloseModalInsert();
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+albumSelect.id, albumSelect)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(artist=>{
        if(artist.id===albumSelect.id){
          artist.id=albumSelect.id;
          artist.bandid=albumSelect.bandid;
          artist.name=albumSelect.name;
          artist.year=albumSelect.year;
        }
      });
      setData(dataNueva);
      openCloseModalEdit();
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+albumSelect.id)
    .then(response=>{
      setData(data.filter(artist=>artist.id!==albumSelect.id));
      openCloseModalDelete();
    }).catch(error=>{
      console.log(error);
    })
  }
  /*
  const seleccionarartist=(artist, caso)=>{
    setAlbumSelect(artist);
    (caso==="Editar")?openCloseModalEdit()
    :
    openCloseModalDelete()
  }
  */
  const openCloseModalInsert=()=>{
    setModalInsert(!modalInsert);
  }
  const openCloseModalEdit=()=>{
    setModalEdit(!modalEdit);
  }
  const openCloseModalDelete=()=>{
    setModalDelete(!modalDelete);
  }
  useEffect(()=>{
    peticionGet();
  }, [])
  const bodyInsert=(
    <div className={styles.modal}>
      <h3>Insert new Album</h3>
      <TextField className={styles.inputMaterial} label="Id" name="id" onChange={handleChange}/>
      <br />
      <TextField className={styles.inputMaterial} label="BandID" name="bandid" onChange={handleChange}/>          
<br />
<TextField className={styles.inputMaterial} label="Name" name="name" onChange={handleChange}/>
      <br />
<TextField className={styles.inputMaterial} label="Year" name="year" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insert</Button>
        <Button onClick={()=>openCloseModalInsert()}>Cancel</Button>
      </div>
    </div>
  )
  const bodyEdit=(
    <div className={styles.modal}>
      <h3>Editar Album</h3>
      <TextField className={styles.inputMaterial} label="Id" name="id" onChange={handleChange} value={albumSelect&&albumSelect.artist}/>
      <br />
      <TextField className={styles.inputMaterial} label="BandId" name="bandid" onChange={handleChange} value={albumSelect&&albumSelect.pais}/>          
      <br />
      <TextField className={styles.inputMaterial} label="Name" name="name" onChange={handleChange} value={albumSelect&&albumSelect.ventas}/>
      <br />
      <TextField className={styles.inputMaterial} label="Year" name="year" onChange={handleChange} value={albumSelect&&albumSelect.genero}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Edit</Button>
        <Button onClick={()=>openCloseModalEdit()}>Cancel</Button>
      </div>
    </div>
  )
  const bodyDelete=(
    <div className={styles.modal}>
      <p>Are you sure you want to delete the album? <b>{albumSelect && albumSelect.artist}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Yes</Button>
        <Button onClick={()=>openCloseModalDelete()}>No</Button>
      </div>
    </div>
  )
  return (
    <div className="App">
      {/* This functionality is being developed!
        <Button onClick={()=>openCloseModalInsert()}>Insert new Album</Button>
        */}
     <MaterialTable
          columns={columns}
          data={data}
          title="Albums by API"  
          /*
          actions={[
            {
              icon: 'edit',
              tooltip: 'Editar Album',
              onClick: (event, rowData) => seleccionarartist(rowData, "Editar")
            },
            {
              icon: 'delete',
              tooltip: 'Eliminar Album',
              onClick: (event, rowData) => seleccionarartist(rowData, "Eliminar")
            }
          ]}
          */
          options={{
            actionsColumnIndex: -1,
          }}
          localization={{
            header:{
              actions: "Actions"
            }
          }}
        />
        <Modal
        open={modalInsert}
        onClose={openCloseModalInsert}>
          {bodyInsert}
        </Modal>
        <Modal
        open={modalEdit}
        onClose={openCloseModalEdit}>
          {bodyEdit}
        </Modal>
        <Modal
        open={modalDelete}
        onClose={openCloseModalDelete}>
          {bodyDelete}
        </Modal>
    </div>
  );
}
export default TableData;