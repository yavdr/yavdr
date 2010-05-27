function LLForLangExists(paramArray, lang){
    var success = true;
    var validstring = "locale_" + lang; //global language var
    for (var z=0; z < paramArray.length; z++){
        validstring += "." + paramArray[z];
        var check = eval("typeof " + validstring + ";");
        if (check == "undefined"){
            success = false;
            break;
        }
    }
    return success;
}

function getLL( param ){
    var paramArray = param.split(".");
    if (!LLForLangExists(paramArray, yavdrwebGlobalInfo.lang)){
        label = "[undefined:"+param+"]";
        //check if we can find the label in English language labels
        if ( yavdrwebGlobalInfo.lang != "en" && LLForLangExists(paramArray, "en")){
            label = "[untranslated] " + eval( "locale_en." + param );
            //alert("Hint for translators: locale." + param + " was not yet translated to language "+lang+".");
        }
        else
        {
            alert("locale_en." + param + " does not exist in English language labels.");
        }
    }
    else
    {
        label = eval( "locale_" + yavdrwebGlobalInfo.lang + "." + param );
    }
    return label;
}