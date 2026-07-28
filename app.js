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
    let html = `<div class="bg-white rounded-xl shadow-lg p-6">
    <h2>Vehiculos encontrados: ${vehiculos.length}</h2>
    
    <table class="min-w-full border border-gray-300">
        <thead class="bg-blue-600 text-white">
             <tr class="hover:bg-gray-100 text-center">
                    <th class="border px-3 py-2">Fecha</th>
                    <th class="border px-3 py-2">Marca</th>
                    <th class="border px-3 py-2">Interno</th>
                    <th class="border px-3 py-2">Dominio</th>
                    <th class="border px-3 py-2">Modelo</th>
                    <th class="border px-3 py-2">Año</th>
                    <th class="border px-3 py-2">Humo</th>
                    <th class="border px-3 py-2">Resultado</th>
                </tr>
            </thead>
            <tbody>
    `;


    vehiculos.forEach(v => {

           html += `
            <tr>
                <td class="border px-3 py-2">${v.fecha}</td>
                <td class="border px-3 py-2">${v.marca}</td>
                <td class="border px-3 py-2">${v.interno}</td>
                <td class="border px-3 py-2">${v.dominio}</td>
                <td class="border px-3 py-2">${v.modelo}</td>
                <td class="border px-3 py-2">${v.anio}</td>
                <td class="border px-3 py-2">${v.humo}</td>
                <td class="border px-3 py-2">${v.resultadoHumo}</td>
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

            console.log(pdf.numPages);

  const vehiculos = [];

for (let i = 1; i <= pdf.numPages; i++) {

    const pagina = await pdf.getPage(i);

    const contenido = await pagina.getTextContent();

    const texto = contenido.items
        .map(item => item.str)
        .join(" ");

    // Solo procesar páginas que tienen las mediciones
    if (!texto.includes("MEDICIONES:")) {
        continue;
    }

    const vehiculo = await leerVehiculo(pagina);

    vehiculos.push(vehiculo);

}
    
            

    
}
 

    catch (error) {
        console.error(error);
        resultado.textContent = "Error al leer PDF";
    }
});