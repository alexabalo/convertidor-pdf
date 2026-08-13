

const loader = document.getElementById("loader");
const progreso = document.getElementById("progreso");
const pdfFile = document.getElementById("pdfFile");
const btnProcesar = document.getElementById("btnProcesar");
const btnDescargar = document.getElementById("btnDescargar");
const resultado = document.getElementById("resultado");



let listaVehiculos = [];

function extraerDato(texto, regex) {
    //texto match, busca patron del texto
    const resultado = texto.match(regex);

    return resultado
        ? resultado[1].trim()
        : "No encontrado";
}
//Crea una función llamada leerVehiculo que recibe una página del PDF.
async function leerVehiculo(pagina) {

    //Le pide a PDF.js todos los fragmentos de texto de esa página.
    const contenido = await pagina.getTextContent();

    const texto = contenido.items
        .map(item => item.str)
        .join(" ");

    const fecha = extraerDato(
        texto,
        /Fecha.*?(\d{2}-\d{2}-\d{2})/
    );

    const marca = extraerDato(
        texto,
        /marca:\s*([A-Z]+)/i
    );

    const interno = extraerDato(
        texto,
        /Interno:\s*(\d+)/
    );

    const dominio = extraerDato(
        texto,
        /Dominio:\s*([A-Z]{3}\s*\d{3})/i
    );

    const modelo = extraerDato(
        texto,
        /Modelo:\s*([A-Z0-9 ]+?)\s+Marca Caja:/i
    );

    const anio = extraerDato(
        texto,
        /Año:\s*(\d{4})/
    );

    const humo = extraerDato(
        texto,
        /Densidad del Humo.*?(\d+,\d+)/
    );

    const resultadoHumo = extraerDato(
        texto,
        /Densidad del Humo[\s\S]*?Resultado\s+(\w+)/

    );

    const propietario = extraerDato(
        texto,
        /Propietario:\s*(.*?)\s+Marca:/i
    );

    const equipo = extraerDato(
        texto,
        /Equipo:\s*(.*?)\s+Año:/i
    );

    const chasis = extraerDato(
        texto,
        /Chasis:\s*(.*?)\s+Motor:/i
    );

    const motor = extraerDato(
    texto,
    /Motor:\s*(.*?)\s+Modelo:/i
    );

    const marcaCaja = extraerDato(
    texto,
    /Marca Caja:\s*(.*?)\s+Tipo de Alimentación/i
    );

    const alimentacion = extraerDato(
    texto,
    /Tipo de Alimentación del Motor\s*(.*?)\s+Potencia del Motor/i
    );

    const potencia = extraerDato(
    texto,
    /Potencia del Motor en CV\s*(\d+)/i
    );



    const vehiculo = {
        fecha,
        propietario,
        marca,
        interno,
        dominio,
        modelo,
        anio,
        humo,
        resultadoHumo,
        equipo,
        chasis,
        motor,
        marcaCaja,
        alimentacion,
        potencia

    };

    return vehiculo;

}

function mostrarTabla(vehiculos) {
    let html = `<div class="bg-white rounded-xl shadow-lg p-6">
    <h2>Vehiculos encontrados: ${vehiculos.length}</h2>
    
    <table class="min-w-full border border-gray-300">
        <thead class="bg-blue-600 text-white">
             <tr class="hover:bg-gray-100 text-center">
                    <th class="border px-3 py-2">Fecha</th>
                    <th class="border px-3 py-2">Propietario</th>
                    <th class="border px-3 py-2">Marca</th>
                    <th class="border px-3 py-2">Interno</th>
                    <th class="border px-3 py-2">Dominio</th>
                    <th class="border px-3 py-2">Modelo</th>
                    <th class="border px-3 py-2">Año</th>
                    <th class="border px-3 py-2">Humo</th>
                    <th class="border px-3 py-2">Resultado</th>
                    <th class="border px-3 py-2">Equipo</th>
                    <th class="border px-3 py-2">Chasis</th>
                    <th class="border px-3 py-2">Motor</th>
                    <th class="border px-3 py-2">Marca de Caja</th>
                    <th class="border px-3 py-2">Tipo de Alimentacion</th>
                    <th class="border px-3 py-2">Potencia</th>
                </tr>
            </thead>
            <tbody>
    `;


    vehiculos.forEach(v => {

        html += `
            <tr>
                <td class="border px-3 py-2">${v.fecha}</td>
                <td class="border px-3 py-2">${v.propietario}</td>
                <td class="border px-3 py-2">${v.marca}</td>
                <td class="border px-3 py-2">${v.interno}</td>
                <td class="border px-3 py-2">${v.dominio}</td>
                <td class="border px-3 py-2">${v.modelo}</td>
                <td class="border px-3 py-2">${v.anio}</td>
                <td class="border px-3 py-2">${v.humo}</td>
                <td class="border px-3 py-2">${v.resultadoHumo}</td>
                <td class="border px-3 py-2">${v.equipo}</td>
                <td class="border px-3 py-2">${v.chasis}</td>
                <td class="border px-3 py-2">${v.motor}</td>
                <td class="border px-3 py-2">${v.marcaCaja}</td>
                <td class="border px-3 py-2">${v.alimentacion}</td>
                <td class="border px-3 py-2">${v.potencia}</td>
            </tr>
        `;

    });


    html += `
            </tbody>
        </table>
        
    </div>

    </div>
    `;

    resultado.innerHTML = html;
}


function exportarExcel(listaVehiculos) {

    const hoja = XLSX.utils.json_to_sheet(listaVehiculos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Vehiculos");

    XLSX.writeFile(libro, "vehiculos.xlsx");

}

          btnDescargar.addEventListener("click", () => {
    exportarExcel(listaVehiculos);
});






btnProcesar.addEventListener("click", async () => {
    const archivo = pdfFile.files[0];

    if (!archivo) {
        resultado.textContent = "Selecciona un archivo PDF";
        return;
    }

    //Mostrar loader
    loader.classList.remove("hidden");

    //Desactivar boton procesar
    btnProcesar.disabled = true;
    btnProcesar.classList.add("opacity-50", "cursor-not-allowed");

    //ocultar descarga mientras procese
    btnDescargar.classList.add("hidden");

    try {
        const arrayBuffer = await archivo.arrayBuffer();

        const pdf =
            await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        console.log("Páginas del PDF:", pdf.numPages);

        const vehiculos = {};

        for (let i = 1; i <= pdf.numPages; i++) {

            progreso.textContent = `Procesando pagina ${i} de ${pdf.numPages}...`

            const pagina = await pdf.getPage(i);

            const contenido = await pagina.getTextContent();

            const texto = contenido.items
                .map(item => item.str)
                .join(" ");

            // Solo procesar páginas que tienen las mediciones
            if (!texto.includes("Datos del vehículo")) {
                continue;


            }

            console.log("Pagina encontrada:", i);

            const vehiculo = await leerVehiculo(pagina);

            if (!vehiculos[vehiculo.interno]) {
                vehiculos[vehiculo.interno] = vehiculo;
            }

  
        }

         listaVehiculos = Object.values(vehiculos);
        console.log("Vehiculos encontrados:", listaVehiculos.length);
        console.table(listaVehiculos);
        mostrarTabla(listaVehiculos);


        loader.classList.add("hidden");
btnProcesar.disabled = false;
btnProcesar.classList.remove("opacity-50", "cursor-not-allowed");

btnDescargar.classList.remove("hidden");



    }


    catch (error) {
        console.error(error);
        resultado.textContent = "Error al leer PDF";

           // Ocultar loader
    loader.classList.add("hidden");

    // Reactivar botón
    btnProcesar.disabled = false;

    btnProcesar.classList.remove(
        "opacity-50",
        "cursor-not-allowed"
    );
    }
});
