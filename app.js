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


    )

    const vehiculo = {
        fecha,
        marca,
        interno,
        dominio,
        modelo,
        anio,
        humo,
        resultadoHumo
    };

    return vehiculo;

}

function mostrarTabla(vehiculos) {
    let html = `
    <h2>Vehiculos encontrados: ${vehiculos.length}</h2>
    
    <table border="1" cellpadding="5">
        <thead>
             <tr>
                    <th>Fecha</th>
                    <th>Marca</th>
                    <th>Interno</th>
                    <th>Dominio</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Humo</th>
                    <th>Resultado</th>
                </tr>
            </thead>
            <tbody>
    `;

    vehiculos.forEach(v => {

           html += `
            <tr>
                <td>${v.fecha}</td>
                <td>${v.marca}</td>
                <td>${v.interno}</td>
                <td>${v.dominio}</td>
                <td>${v.modelo}</td>
                <td>${v.anio}</td>
                <td>${v.humo}</td>
                <td>${v.resultadoHumo}</td>
            </tr>
        `;

    });


     html += `
            </tbody>
        </table>
    `;

    resultado.innerHTML = html;
}




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
             mostrarTabla(vehiculos);

    }

 

    catch (error) {
        console.error(error);
        resultado.textContent = "Error al leer PDF";
    }
});