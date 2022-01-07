require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar
} = require('./helpers/inquirer');

const Tareas = require('./models/tareas');



console.clear();


const main = async () => {
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();
    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }


    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1': // crear opcion                
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);
                break;

            case '2':
                tareas.listadoCompleto();
                break;

            case '3': //listar completadas
                tareas.listarPendientesCompletadas(true);
                break;

            case '4': //listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;


            case '6': //borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('¿Está seguro?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr);

        if (opt !== '0') await pausa();

    } while (opt !== '0');



}


main();