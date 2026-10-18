import styles from "./TodoForm/todoApp.module.css";
import { useState, useEffect, use } from "react";
import TodoForm from "./TodoForm/TodoForm";
import EditNoteForm from "./TodoForm/EditNoteForm/EditNoteForm";
import {SquarePen, Trash} from "lucide-react"

function TodoApp({ notasApp }) {
    const [notas, setNotas] = useState([]);
    const [notaEditandoId, setNotaEditandoId]=useState(null)
    const [tareas, setTareas] = useState([]);

    const onHandleClick=()=>{
        setTareas([...tareas, "nueva tarea"]); // esta es la forma correcta de setear un estado, toca meterlo dentro de un manejador de eventos, evita loop infinito
        //setTarea(tareas.push("nueva tarea")) forma incorrecta, fuera del manejador, modificaria el array original, mala practica en react
    }
    
    // setTareas([...tareas, "nueva tarea"]); forma incorrecta, fuera del manejador de eventos

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/notas");

                if (!response.ok) {
                    throw new Error(`Error http: ${response.status}`);
                }
                const data = await response.json();
                setNotas(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        console.log("NOTAS CARGADAS");
    }, []);

    const agregarNota = (nuevaNota)=>{
        setNotas([...notas, nuevaNota]);
    }
    
    const eliminarNota = (id)=>{
        setNotas(notas.filter(nota=>nota.id !== id));
        fetch(`http://localhost:3000/notas/${id}`, {
            method: "DELETE"
        })
        .then(response=>{
            if (!response.ok){
                throw new Error(`Error al eliminar la nota: ${response.status}`)
            }
            console.log("Nota eliminada correctamente");
        })
        .catch((error)=>console.error(error));
    }

    const actualizarNota=(notaActualizada)=>{
        setNotas(
            notas.map((nota)=>{
                return nota.id===notaActualizada.id ? notaActualizada : nota;
            })
        );
    };
    
    const marcarComoCompleta=async(notaId)=>{
        try{
            const nota=notas.find(nota=>nota.id===notaId)
            const response = await fetch(`http://localhost:3000/notas/${notaId}`, {
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({completed:!nota.completed}),
              }
            );
            if (!response.ok) {
                throw new Error(
                    `Error al actualizar una nota: ${response.status}`
                );
            }
            
            const notaActualizada = await response.json()
            setNotas(notas.map(nota=>nota.id===notaId?notaActualizada:nota))
        }catch(error){
            console.error(error)
        }
    }
    
    return (
        <>
            <h1 className={styles.titulo}>Notas</h1>
            <TodoForm onAgregarNota={agregarNota}/>
            <ul className={styles.noteList}>
                {notas.map((nota) =>
                    <li className={styles.noteItem} key={nota.id}>
                        <span>
                            {nota.text}{nota.completed ? "✅" : "❎"}
                        </span>
                        <div className={styles.iconsContainer}>
                            <button onClick={()=>marcarComoCompleta(nota.id)}>
                                {nota.completed?"Desmarcar":"Completar"}
                            </button>
                            <SquarePen onClick={()=>setNotaEditandoId(nota.id)} size={26}/>
                            <Trash 
                                onClick={()=>eliminarNota(nota.id)}
                                size={26}
                            />
                        </div>
                        {
                            notaEditandoId === nota.id && (
                                <EditNoteForm 
                                    nota={nota}
                                    onEditarNota={actualizarNota}
                                    onCancelar={()=>setNotaEditandoId(null)}
                                />
                            )
                        }
                    </li>
                )}
            </ul>
        </>
    );
}

export default TodoApp;