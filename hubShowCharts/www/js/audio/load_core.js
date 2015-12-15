/*
 * ChiVox API provides ChiVox Ltd's (www.chivox.com) world leading pronunciation
 * evaluation, speech recognition technologies, and text-to-speech technologies.
 *
 * ChiVox Ltd opens this API hoping make every programmer be capable to implement
 * speech enabled applicaitons.
 *
 * Copyright (c) 2008-2014 by ChiVox. All rights reserved.
 *
 * $Id: load_core.js 4938 2014-08-21 09:26:05Z zhiyuan.liang $
 */
chivox = {};
(function(){
    chivox.jsLoadStart = new Date().getTime();

    chivox.getCss = function(src){
        document.write('<' + 'link href="' + src + '"' + ' rel="stylesheet" type="text/css" />');
    }

    chivox.getScript = function(src){
        document.write('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>');
    }
    
    var generateGUID = (typeof(window.crypto) != 'undefined' && typeof(window.crypto.getRandomValues) != 'undefined') ? function(){
        // If we have a cryptographically secure PRNG, use that
        // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
        var buf = new Uint16Array(8);
        window.crypto.getRandomValues(buf);
        var S4 = function(num){
            var ret = num.toString(16);
            while (ret.length < 4) {
                ret = "0" + ret;
            }
            return ret;
        };
        return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
    } : function(){
        // Otherwise, just use Math.random
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    
    var isDebug = false;
    // chivox.host = "http://localhost";

	chivox.jssdkVersion = "3.2.6";
    chivox.monitorUrl = "http://log.chivox.com/sdk-monitor/sdklog";
    chivox.apiVersion = "v3.2";
    
    chivox.host = chivox.host || "http://sdk.cloud.chivox.com/chivoxsdk-js/" + chivox.apiVersion;
    
    chivox.getCss(chivox.host + "/Resources/themes/default/aidebug.css");
    chivox.getCss(chivox.host + "/Resources/themes/default/ui.css");
    
    chivox.logId = generateGUID();
    if (isDebug) {
        chivox.getScript(chivox.host + "/Resources/jquery/aijquery-1.6.2-min.js");

        chivox.getScript(chivox.host + "/Classes/Ai.js");
        chivox.getScript(chivox.host + "/Classes/AiDebug.js");
        chivox.getScript(chivox.host + "/Classes/AiFlashDetect.js");
        chivox.getScript(chivox.host + "/Classes/AiFlot.js");
        chivox.getScript(chivox.host + "/Classes/AiGChart.js");
        chivox.getScript(chivox.host + "/Classes/AiPanel.js");
        chivox.getScript(chivox.host + "/Classes/AiPanelParagraph.js");
        chivox.getScript(chivox.host + "/Classes/AiPlayer.js");
        chivox.getScript(chivox.host + "/Classes/AiRecorder.js");
        chivox.getScript(chivox.host + "/Classes/AiStatusCode.js");
        chivox.getScript(chivox.host + "/Classes/AiTone.js");
        chivox.getScript(chivox.host + "/Classes/CnSentRec.js");
        chivox.getScript(chivox.host + "/Classes/CnAsrRec.js");
        chivox.getScript(chivox.host + "/Classes/CnSentScore.js");
        chivox.getScript(chivox.host + "/Classes/CnWordScore.js");
        chivox.getScript(chivox.host + "/Classes/EnScoreMap.js");
        chivox.getScript(chivox.host + "/Classes/EnSentRec.js");
        chivox.getScript(chivox.host + "/Classes/EnSentScore.js");
        chivox.getScript(chivox.host + "/Classes/EnWordScore.js");
        chivox.getScript(chivox.host + "/Classes/LocationSearch.js");
        chivox.getScript(chivox.host + "/Classes/SpeechResource.js");
        chivox.getScript(chivox.host + "/Classes/UpdateSDKMonitor.js");
        
    } else {
        chivox.getScript(chivox.host + "/Resources/jquery/aijquery-1.6.2-min.js");
        chivox.getScript(chivox.host + "/Resources/chivox-min.js");
    }
})();
