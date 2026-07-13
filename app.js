const pdfFile = document.getElementById("pdfFile");
const btnProcesar = document.getElementById("btnProcesar");
const resultado = document.getElementById("resultado");

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

    


    const vehiculo = {
        fecha,
        marca,
        interno,

    };

    return vehiculo;


}

//dominio,
// modelo,
// anio,
// humo,
// resultadoHumo

btnProcesar.addEventListener("click", async () => {
    const archivo = pdfFile.files[0];

    if (!archivo) {
        resultado.textContent = "Selecciona un archivo PDF";
        return;
    }

    try {
        const arrayBuffer = await archivo.arrayBuffer();

        const pdf =
            await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const vehiculos = [];

        //esta parte es para contar paginas de a 1
        for (let i = 25; i <= 27; i++) {
            const pagina = await pdf.getPage(i);
            const vehiculo = await leerVehiculo(pagina);
            vehiculos.push(vehiculo);
        }

        console.table(vehiculos);

        resultado.innerHTML = `
        <h2 class="text-xl font-bold mb-4">
        Vehiculos encontrados: ${vehiculos.length}
        </h2>
        <pre>${JSON.stringify(vehiculos, null, 2)}</pre>
        `;



    }

    catch (error) {
        console.error(error);
        resultado.textContent = "Error al leer PDF";
    }


});