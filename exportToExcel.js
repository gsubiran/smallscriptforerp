function myFnExcelReport(iframeId)
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = $('.oe_timesheet_weekly_date_head').closest('table')[0];//document.getElementById('headerTable'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        document.getElementById(iframeId).document.open("txt/html","replace");
        document.getElementById(iframeId).document.write(tab_text);
        document.getElementById(iframeId).document.close();
        document.getElementById(iframeId).focus(); 
        sa=document.getElementById(iframeId).document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}

(function AddNeededElements(){
	var iFrameName='myExcelExportIFrameName';
	var iFrame = document.createElement("iframe");
	iFrame.setAttribute("id",iFrameName);
	iFrame.setAttribute("style","display:none");
	
	var btnExport = document.createElement("button");
	btnExport.setAttribute("onclick","myFnExcelReport('"+iFrameName+"');");
	btnExport.innerHTML = "Exportar a Excel";
	
	document.body.appendChild(iFrame);
	document.getElementsByClassName("oe_form_group ")[0].appendChild(btnExport);
})();
