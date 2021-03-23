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
    width: 400,
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
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [artistaSeleccionado, setArtistaSeleccionado]=useState({
    id: "",
    bandID: "",
    name: "",
    year: ""
  })

  const handleChange=e=>{
    const {id, value}=e.target;
    setArtistaSeleccionado(prevState=>({
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
    await axios.post(baseUrl, artistaSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+artistaSeleccionado.id, artistaSeleccionado)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(artista=>{
        if(artista.id===artistaSeleccionado.id){
          artista.id=artistaSeleccionado.id;
          artista.bandid=artistaSeleccionado.bandid;
          artista.name=artistaSeleccionado.name;
          artista.year=artistaSeleccionado.year;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+artistaSeleccionado.id)
    .then(response=>{
      setData(data.filter(artista=>artista.id!==artistaSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarArtista=(artista, caso)=>{
    setArtistaSeleccionado(artista);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  useEffect(()=>{
    peticionGet();
  }, [])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Album</h3>
      <TextField className={styles.inputMaterial} label="Id" name="artista" onChange={handleChange}/>
      <br />
      <TextField className={styles.inputMaterial} label="BandID" name="pais" onChange={handleChange}/>          
<br />
<TextField className={styles.inputMaterial} label="Ventas" name="ventas" onChange={handleChange}/>
      <br />
<TextField className={styles.inputMaterial} label="Género" name="genero" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Album</h3>
      <TextField className={styles.inputMaterial} label="Album" name="artista" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.artista}/>
      <br />
      <TextField className={styles.inputMaterial} label="País" name="pais" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.pais}/>          
<br />
<TextField className={styles.inputMaterial} label="Ventas" name="ventas" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.ventas}/>
      <br />
<TextField className={styles.inputMaterial} label="Género" name="genero" onChange={handleChange} value={artistaSeleccionado&&artistaSeleccionado.genero}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el album <b>{artistaSeleccionado && artistaSeleccionado.artista}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
      <br />
      <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar Album</Button>
      <br /><br />
     <MaterialTable
          columns={columns}
          data={data}
          title="Albums!"  
          actions={[
            {
              icon: 'edit',
              tooltip: 'Editar Album',
              onClick: (event, rowData) => seleccionarArtista(rowData, "Editar")
            },
            {
              icon: 'delete',
              tooltip: 'Eliminar Album',
              onClick: (event, rowData) => seleccionarArtista(rowData, "Eliminar")
            }
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          localization={{
            header:{
              actions: "Acciones"
            }
          }}
        />


        <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>

        
        <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
          {bodyEditar}
        </Modal>

        <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
    </div>
  );
}

export default TableData;