
(function CargaRapidaDeHoras(){
alert("ATENCION!!! Esta es solo una herramienta en fase de prueba que ayuda a cargar los campos de las horas rapidamente en el sitio del ERP. \r\n Esto no suplanta en ningun momento los procedimientos existentes. Usela bajo su propio riesgo y no olvide validar que los datos sean los que esperaba antes presionar el boton guardar.");

var proyectosNombreSelector = ".oe_timesheet_weekly_account:has(a)";
var domArrayProyectos = $(proyectosNombreSelector);

var myArrayTareas = [];

//Se itera en el dom para obtener informacion sobre las tareas existentes
for (var idx = 0; idx < domArrayProyectos.length; idx++) {
	var proyItem = $($(proyectosNombreSelector)[idx]);	
	var tareaContainer = proyItem.next();
	
	var proyNombre = proyItem.children("a").text();
	var tareaNombre = tareaContainer.children("a").text();
	
	myArrayTareas.push({
		Proyecto: proyNombre,
		Tarea: tareaNombre
	});
	console.log("Proyecto '" + proyNombre + "' - " + "tarea '" + tareaNombre + "'.");
	//var  $($($(proyectosNombreSelector)[0]).next().find("a")[0]);
}

console.log("Tareas: ",myArrayTareas);

var domAllFechas = domArrayProyectos.closest("table").parent().next().children("table");
var cantidadDiasMes = 0;
//Se iteran las tareas existentes, para asociarlas con los campos de los dias correspondientes
for (var idx = 0; idx < myArrayTareas.length; idx++) {
	var myItemTarea = myArrayTareas[idx];
	
	var arrayFechasItemTarea = domAllFechas.children().children().eq(idx + 1).children("td");//El eq(0) es el header, por eso es idx+1
	arrayFechasItemTarea=arrayFechasItemTarea.slice(0,arrayFechasItemTarea.length - 3);//Se quitan los ultimos tres items que no son necesarios, se relacionan con los totales y cosas internas que no se necesitan
	//Se asignan las correspondientes fechas con la
	//correspondiente tarea
	myItemTarea["Fechas"] = arrayFechasItemTarea;
	
	if (idx === 0){
		cantidadDiasMes=arrayFechasItemTarea.length;
	}
}
console.log("Cantidad dias mes: ",cantidadDiasMes);
console.log("Tareas: ",myArrayTareas);

var numeroDiaDesde = null;
var intentosPosibles = 5;

while(isNaN(parseInt(numeroDiaDesde))
	|| (parseInt(numeroDiaDesde) <=0
	|| parseInt(numeroDiaDesde) > cantidadDiasMes)){
	
	if(intentosPosibles===0){
		alert("Ingresaste un valor incorrecto " + intentosPosibles + " veces. Tienes problemas o estas jugando? se seteara el valor por defecto 1.");
		numeroDiaDesde = 1;
		break;
	}
	
	if(numeroDiaDesde!==null){
		alert("El valor: " + numeroDiaDesde + " no es valido para el numero de dia inicial. Intente nuevamente.");
	}
	numeroDiaDesde = prompt("Cargar desde el dia: ", "1");
	
	intentosPosibles--;
}
numeroDiaDesde=parseInt(numeroDiaDesde);

intentosPosibles=5;

var numeroDiaHasta = null;

while(numeroDiaHasta === null
|| (numeroDiaHasta.toLowerCase() !== "hoy" && isNaN(parseInt(numeroDiaHasta)))
|| ( parseInt(numeroDiaHasta) <= 0
|| parseInt(numeroDiaHasta) > cantidadDiasMes)){
	
	if(intentosPosibles===0){
		alert("Ingresaste un valor incorrecto " + intentosPosibles + " veces. Tienes problemas o estas jugando? se seteara el valor por defecto 'hoy'.");
		numeroDiaHasta = "hoy";
		break;
	}
	
	if(numeroDiaHasta!==null){
		alert("El valor: " + numeroDiaHasta + " no es valido para el numero de dia final. Intente nuevamente.")
	}
	numeroDiaHasta = prompt("Cargar hasta el dia ('hoy' para cargar hasta hoy si estamos en el mes que esta cargando): ", "hoy");
}


//Se iteran los dias del mes
for (var idxDia = (numeroDiaDesde -1); idxDia < cantidadDiasMes ; idxDia++) {	
	var banderaUserFuerzaSalir = false;
	var banderaDateToday = false;
	var tareasAnterioresHs ="";
	
	//console.log("id dia ", idxDia);
	//Se iteran los proyectos para poder asignar las horas del dia
	for (var idxTarea = 0; idxTarea < myArrayTareas.length; idxTarea++) {
		var myItemTarea = myArrayTareas[idxTarea];		
		var domItemDiaTarea = $(myItemTarea.Fechas[idxDia]);
		
		banderaDateToday = false;//Inicializacion de la bandera
		
		//Validar si es el dia de hoy
		if(domItemDiaTarea.hasClass("oe_timesheet_weekly_today")){
			var dateToday = new Date();
			if(dateToday.getDate() === (idxDia+1)){
				banderaDateToday = true;
			}
			
			//Validar si es un finde
			if(!banderaDateToday){
				//Significa que es un finde, no se cargan horas
				break;
			}
		}
		
		
		var domItemDiaTareaInput = domItemDiaTarea.children("input");
		
		var horasExistentesDiaTarea = domItemDiaTareaInput.val();
		var mensajeAMostrar =  "(info: escriba 'salir' en cualquier momento para terminar.)\r\n"
							   + "Linea = " + (idxTarea+1) + " \r\n "
							   + "Día Nº " + (idxDia+1) + " - horas actuales: "+ tareasAnterioresHs + " \r\n "
							   + "Proyecto: " + myItemTarea.Proyecto + " \r\n "
							   + "Tarea: " + myItemTarea.Tarea + " \r\n "
							   + "Especifique las horas: ";
		var horasDiaTareaIngresada = prompt(mensajeAMostrar,(horasExistentesDiaTarea==0 ? "00:00" : horasExistentesDiaTarea));
		
		if (horasDiaTareaIngresada.toLowerCase() === "salir"){
			banderaUserFuerzaSalir= true;
			break;
		}
		
		tareasAnterioresHs = tareasAnterioresHs + (tareasAnterioresHs==="" ? "" : " + " )  + horasDiaTareaIngresada;
				
		domItemDiaTareaInput.val(horasDiaTareaIngresada);
		
		domItemDiaTareaInput.change();//Se llama al change() para que el ERP tome que el campo fue cambiado
		//$('<div id="dialog" title="Basic dialog"><p>Lala</p></div>').dialog();
	}
	
	//Usuario forzo la salida
	if (banderaUserFuerzaSalir){
		alert("El usuario a salido.")
		break;
	}
	
	if(numeroDiaHasta.toLowerCase() === "hoy"
		&& banderaDateToday){
			alert("Carga hasta el dia de hoy finalizada, no olvide guardar los datos!");
			//Carga hasta hoy
			break;
	}	
	console.log("numeroDiaHasta: ", numeroDiaHasta);
	console.log("Dia N: ", (idxDia+1));
	
	if(numeroDiaHasta == (idxDia+1)){
		alert("Carga hasta el dia " + numeroDiaHasta + " finalizada, no olvide guardar los datos!")
		//Carga hasta el dia establecido
		break;
	}
	
}
})();
