
const API = "http://localhost:5140/api/CargaVehiculo";

listarVehiculos();

async function listarVehiculos() {

    const respuesta = await fetch(API);

    const vehiculos = await respuesta.json();

    const tabla = document.getElementById("TablaVehiculos");

    tabla.innerHTML = "";

    vehiculos.forEach(vehiculo => {

        tabla.innerHTML += `
            <tr>
                <td>${vehiculo.marca}</td>
                <td>${vehiculo.modelo}</td>
                <td>${vehiculo.anio}</td>
                <td>${vehiculo.patente}</td>
                <td>${vehiculo.km}</td>
                <td>${new Date(vehiculo.fechaIngreso).toLocaleDateString()}</td>
                <td>${vehiculo.disponible ? "NO" : "SI"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="EditarVehiculo(${vehiculo.vehiculoId})">Editar</button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="DeleteVehiculos(${vehiculo.vehiculoId})">Eliminar</button>
                </td>
            </tr>
        `;

    });
}


document.getElementById("formVehiculo").addEventListener("submit", async function(event) {

    event.preventDefault();

    const vehiculo = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        anio: parseInt(document.getElementById("anio").value),
        patente: document.getElementById("patente").value,
        km: parseInt(document.getElementById("km").value)
    };

    const respuesta = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculo)
    });

        alert("Vehículo cargado correctamente");

        document.getElementById("formVehiculo").reset();

        listarVehiculos();


});

async function DeleteVehiculos(id) {

    const respuesta = await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

        alert("Vehículo eliminado correctamente");

        listarVehiculos();

}


async function EditarVehiculo(id) {

    const respuesta = await fetch(`${API}/${id}`);

    const vehiculo = await respuesta.json();

    document.getElementById("editarId").value = vehiculo.vehiculoId;
    document.getElementById("editarMarca").value = vehiculo.marca;
    document.getElementById("editarModelo").value = vehiculo.modelo;
    document.getElementById("editarAnio").value = vehiculo.anio;
    document.getElementById("editarPatente").value = vehiculo.patente;
    document.getElementById("editarKm").value = vehiculo.km;

    const modal = new bootstrap.Modal(
        document.getElementById("modalEditar")
    );

    modal.show();
}

async function GuardarCambios() {

    const id = document.getElementById("editarId").value;

    const vehiculo = {
        vehiculoId: parseInt(id),
        marca: document.getElementById("editarMarca").value,
        modelo: document.getElementById("editarModelo").value,
        anio: parseInt(document.getElementById("editarAnio").value),
        patente: document.getElementById("editarPatente").value,
        km: parseInt(document.getElementById("editarKm").value)
    };

    const respuesta = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculo)
    });

    if (respuesta.ok) {

        alert("Vehículo actualizado correctamente");

        listarVehiculos();

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalEditar")
        );

        modal.hide();

    } else {

        alert("Error al actualizar el vehículo");

    }
}












