import styles from "./todoForm.module.css"
import { useState } from "react";
import {Plus} from "lucide-react"

const TodoForm=({onAgregarNota})=>{
    const [textNote, setTextNote] = useState("")
    
    const handleSubmit=(event)=>{
        event.preventDefault();
        // envia nota bd
        if (textNote === ""){
            console.log("No se pueden agregar notas vacias")
            return
        }
        
        const newNota={
            text:textNote,
            completed:false
        }
        
        fetch("http://localhost:3000/notas", {
            method:"POST",
            headers:{
                "Context-type": "application/json"
            },
            body:JSON.stringify(newNota)
        })
        .then(response=>response.json())
        .then(data=>{
            onAgregarNota(data)
            setTextNote("")
        })
    }  
    
    {/*
    const handleChange=()=>{
        setTextNote(e.target.value)
    }
    */}
    
    return(
        <div className={styles.formContainer}>
            <h2>Todo Form </h2>
            <form onSubmit={handleSubmit}>
                <input 
                    id="nota" 
                    name="nota" 
                    value={textNote}
                    onChange={(e=>setTextNote(e.target.value))}
                >
                </input>
                <button type="submit">
                    <Plus size={12} />
                    Crear nota
                </button>
            </form>
            
        </div>
        
    )
}

export default TodoForm