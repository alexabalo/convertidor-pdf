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

        //esta parte es para contar paginas de a 1
        const pagina = await pdf.getPage(25);
        //obtiene los items como inspection, report etc.
        const contenido = await pagina.getTextContent();

        // recorre con map todos los str y los devuelve a texto normal
        const texto = contenido.items.map(item => item.str).join(" ");

        console.log(texto.substring(0, 1000));

        console.log(texto.includes("Fecha"));
        console.log(texto.match(/\d{2}-\d{2}-\d{2}/))

        console.log("Pagina:", pagina.pageNumber);
        console.log(texto);

        console.log(
            texto.indexOf("Fecha")
        );

        console.log(
            texto.substring(
                texto.indexOf("Fecha"),
                texto.indexOf("Fecha") + 150
            )
        );

        console.log(
            texto.substring(
                texto.indexOf("Dominio"),
                texto.indexOf("Dominio") + 100
            )
        );

        console.log(
            texto.substring(
                texto.indexOf("Modelo"),
                texto.indexOf("Modelo") + 100
            )
        );

        const fecha = extraerDato(
            texto,
            /Fecha.*?(\d{2}-\d{2}-\d{2})/
        );

        const marca = extraerDato(
            texto,
            /marca:\s*([A-Z]+)/i
        );

        const interno =
            extraerDato(
                texto,
                /Interno:\s*(\d+)/
            );

        //esto busca el dominio
        const dominioMatch = texto.match(
            /Dominio:\s*([A-Z]{3}\s*\d{3})/i
        );

        //este lo guardo en el caso de coincidir
        const dominio = dominioMatch
            ? dominioMatch[1].trim()
            : "No encontrado";



        const modeloMatch =
            texto.match(
                /Modelo:\s*([A-Z0-9 ]+?)\s+Marca Caja:/i
            );

        const modelo =
            modeloMatch
                ? modeloMatch[1].trim()
                : "No encontrado";

        const anio = 
        extraerDato(
            texto,
            /Año:\s*(\d{4})/
        );
        
        //Busca la frase "Densidad del Humo".
        const humoMatch = 
        texto.match(
            /Densidad del Humo.*?(\d+,\d+)/
        );

        //Si humoMatch existe (se encontró coincidencia)
        const humo = humoMatch
            ? humoMatch[1]
            : "No encontrado";

            //Buscar el resultado del ensayo
        const resultadoHumoMatch = 
        texto.match(
            /Densidad del Humo[\s\S]*?Resultado\s+(\w+)/
        );

        //Guardar el resultado
        const resultadoHumo = 
        resultadoHumoMatch
        ? resultadoHumoMatch[1]
        : "No encontrado";

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

        console.log(vehiculo);




        //remplazo temporalmente
        //resultado.innerHTML = `PDF cargado.
        //Total de paginas: ${pdf.numPages}`;

        resultado.innerHTML = `<div class="text-left">
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Marca:</strong> ${marca}</p>
        <p><strong>Interno:</strong> ${interno}</p>
        <p><strong>Dominio:</strong> ${dominio}</p>
        <p><strong>Modelo:</strong> ${modelo}</p>
         <p><strong>Año:</strong> ${anio}</p>
        <p><strong>Humo:</strong>${humo}</p>
        <p><strong>Resultado Humo</strong> ${resultadoHumo}</p>
        </div>

        <pre class="mt-6 p-4 bg-slate-100 rounded-lg overflow-auto text-sm">${texto}</pre>`;


    }

    catch (error) {
        console.error(error);
        resultado.textContent = "Error al leer PDF";
    }


});