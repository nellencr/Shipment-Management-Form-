var connToken = "90932387|-31949271492044069|90955545";
var shipDBName = "DELIVERY-DB ";
var shipRelationName = "SHIPMENT-TABLE";
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";

function validateData() {
    var shipNo, shipDesc, shipSource, shipDest, shipDate, shipDeli;
    shipNo = $("#shipNo").val();
    shipDesc = $("#shipDesc").val();
    shipSource = $("#shipSource ").val();
    shipDest = $("#shipDest").val();
    shipDate = $("#shipDate").val();
    shipDeli = $("#shipDeli").val();
    $("#shipNo").focus();

    if (shipNo === "") {
        alert("Shipment number is missing");
        $("#shipNo").focus();
        return "";
    }

    if (shipDesc === "") {
        alert("Shipment description is missing");
        $("#shipDesc").focus();
        return "";
    }

    if (shipSource === "") {
        alert("Shipment source is missing");
        $("#shipSource").focus();
        return "";
    }

    if (shipDest === "") {
        alert("Shipment destiny is missing");
        $("#shipDest").focus();
        return "";
    }

    if (shipDate === "") {
        alert("Shipment date is missing");
        $("#shipDate").focus();
        return "";
    }

    if (shipDeli === "") {
        alert("Shipment delivery is missing");
        $("#shipDeli").focus();
        return "";
    }

    var jsonStrObj = {
        id: shipNo,
        description: shipDesc,
        source: shipSource,
        destiny: shipDest,
        date: shipDate,
        delivery: shipDeli
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm(jsonObj) {
    $("#shipNo").val("");
    $("#shipDesc").val(""); 
    $("#shipSource").val("");
    $("#shipDest").val("");
    $("#shipDate").val("");
    $("#shipDeli").val("");
    $("#shipNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#shipNo").focus();
}
function saveRecNo2LS(jsonObj){
    var recdata = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", recdata.rec_no);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#shipDesc").val(record.description);
    $("#shipSource").val(record.source);
    $("#shipDest").val(record.destiny);
    $("#shipDate").val(record.date);
    $("#shipDeli").val(record.delivery);
    }

function getShipIdAsJsonObj(){
    var shipNo = $("#shipNo").val();
    var jsonStr = {
        id : shipNo
    };
    return JSON.stringify(jsonStr); 
}

function getSHIP() {
    var shipIdJsonObj = getShipIdAsJsonObj();
    console.log(shipIdJsonObj);
    var getRequest = createGET_BY_KEYRequest(connToken, shipDBName, shipRelationName, shipIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status == 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#shipDesc").focus();
    } else if (resJsonObj.status === 200) {
        $("#shipNo").prop("disabled", true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#shipDesc").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj == "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj, shipDBName, shipRelationName);
    alert(jsonStrObj);
    console.log(putRequest);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();

    $("#shipNo").focus();
}

function updateData() {
    $("#update").prop("disabled", true);
    jsonUpdate = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonUpdate, shipDBName, shipRelationName, localStorage.getItem("recno"));
    console.log(updateRequest);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#empid").focus();

}