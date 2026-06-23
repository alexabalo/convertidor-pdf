const pdfFile = document.getElementById("pdfFile");
const btnProcesar = document.getElementById("btnProcesar");
const resultado = document.getElementById("resultado");

btnProcesar.addEventListener("click",async ()=> {
    const archivo = pdfFile.files[0];

    if (!archivo) {
        resultado.textContent = "Selecciona un archivo PDF";
        return;
    }

    try {
        const arrayBuffer = await archivo.arrayBuffer();

        const pdf = 
        await pdfjsLib.getDocument({data: arrayBuffer}).promise;

        //esta parte es para contar paginas de a 1
        const pagina = await pdf.getPage(25);
        //obtiene los items como inspection, report etc.
        const contenido = await pagina.getTextContent();

        // recorre con map todos los str y los devuelve a texto normal
        const texto = contenido.items.map(item => item.str).join(" ");

         console.log("Pagina:", paginaNumber);


                //remplazo temporalmente
        //resultado.innerHTML = `PDF cargado.
        //Total de paginas: ${pdf.numPages}`;

        resultado.innerHTML = `<h3>Pagina 1</h3>

        <pre>${texto}</pre>`;


    }

    catch(error){
        console.error(error);
        resultado.textContent = "Error al leer PDF";
    }


});