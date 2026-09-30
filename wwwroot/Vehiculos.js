
const API = "/api/CargaVehiculo";

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
                <td class="dato-extra">${vehiculo.patente}</td>

                <td class="dato-extra">${vehiculo.anio}</td>

                <td class="dato-extra">${vehiculo.km}</td>

                <td class="dato-extra">
                    ${new Date(vehiculo.fechaIngreso).toLocaleDateString()}
                </td>

                <td>
                    ${vehiculo.disponible
                ? '<span class="badge bg-success">Disponible</span>'
                : '<span class="badge bg-danger">No disponible</span>'
            }
                </td>

                <td class="acciones-grandes">
                    <button
                        class="btn btn-warning btn-sm"
                        onclick="EditarVehiculo(${vehiculo.vehiculoId})">
                        Editar
                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="DeleteVehiculos(${vehiculo.vehiculoId})">
                        Eliminar
                    </button>
                </td>

                <td class="accion-movil">
                    <button
                        class="btn btn-primary btn-sm"
                        onclick="MostrarDetalles(${vehiculo.vehiculoId})">
                        Ver más
                    </button>
                </td>
            </tr>
        `;
    });
}


document.getElementById("formVehiculo").addEventListener("submit", async function (event) {

    event.preventDefault();

    const vehiculo = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        anio: parseInt(document.getElementById("anio").value),
        patente: document.getElementById("patente").value,
        km: parseInt(document.getElementById("km").value),
        fechaIngreso: new Date().toISOString()
    };

    if (vehiculo.anio < 1886 || vehiculo.anio > new Date().getFullYear()) {
        alert("Por favor, ingrese un año válido.");
        return;
    }

    if (vehiculo.km < 0) {
        alert("Por favor, ingrese un kilometraje válido.");
        return;
    }

    if (vehiculo.modelo.trim() === "") {
        alert("Por favor, ingrese un modelo válido.");
        return;
    }

    const respuesta = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehiculo)
    });

    if (respuesta.ok) {
        alert("Vehículo cargado correctamente");
        document.getElementById("formVehiculo").reset();
        listarVehiculos();
    } else {
        alert("Error al cargar el vehículo.");
    }
});


async function MostrarDetalles(id) {

    const respuesta = await fetch(`${API}/${id}`);

    if (!respuesta.ok) {
        alert("No se pudo obtener el vehículo.");
        return;
    }

    const vehiculo = await respuesta.json();

    document.getElementById("detalleMarca").textContent = vehiculo.marca;
    document.getElementById("detalleModelo").textContent = vehiculo.modelo;
    document.getElementById("detalleAnio").textContent = vehiculo.anio;
    document.getElementById("detallePatente").textContent = vehiculo.patente;
    document.getElementById("detalleKm").textContent = vehiculo.km;

    document.getElementById("detalleFecha").textContent =
        new Date(vehiculo.fechaIngreso).toLocaleDateString();

    document.getElementById("detalleDisponible").innerHTML =
        vehiculo.disponible
            ? '<span class="badge bg-success">Disponible</span>'
            : '<span class="badge bg-danger">No disponible</span>';

    document.getElementById("btnEditarDetalle").onclick = function () {

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalDetalles")
        );

        modal.hide();

        EditarVehiculo(id);
    };

    const btnEliminar = document.getElementById("btnEliminarDetalle");

    if (vehiculo.disponible) {

        btnEliminar.disabled = true;
        btnEliminar.textContent = "No se puede eliminar";
        btnEliminar.onclick = null;

    } else {

        btnEliminar.disabled = false;
        btnEliminar.textContent = "Eliminar";

        btnEliminar.onclick = function () {

            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalDetalles")
            );

            modal.hide();

            DeleteVehiculos(id);
        };
    }

    const modal = new bootstrap.Modal(
        document.getElementById("modalDetalles")
    );

    modal.show();
}


async function DeleteVehiculos(id) {

    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {

        const respuestaVehiculo = await fetch(`${API}/${id}`);

        if (!respuestaVehiculo.ok) {
            alert("No se pudo encontrar el vehículo.");
            return;
        }

        const vehiculo = await respuestaVehiculo.json();

        if (vehiculo.disponible === true) {
            alert("El vehículo está disponible y no se puede eliminar.");
            return;
        }

        const respuesta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Vehículo eliminado correctamente");
            listarVehiculos();
        } else {
            const mensaje = await respuesta.text();
            alert(mensaje || "No se pudo eliminar el vehículo.");
        }
    }
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
    document.getElementById("editarDisponible").checked = vehiculo.disponible;

    if (vehiculo.fechaIngreso) {
        document.getElementById("editarFecha").value =
            new Date(vehiculo.fechaIngreso).toISOString().split("T")[0];
    }

    document.getElementById("editarDisponible").checked = vehiculo.disponible;

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
        km: parseInt(document.getElementById("editarKm").value),
        fechaIngreso: document.getElementById("editarFecha").value,
        disponible: document.getElementById("editarDisponible").checked
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