chivox = chivox || {};
chivox.AiDebug = function(a) {
    if (typeof window.console == "undefined") window.console = {};
    for (var b = Array.prototype.slice,
             c = {},
             g = 9,
             e = ["error", "warn", "info", "debug", "log"], d = "assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "), f = d.length, j = []; --f >= 0;)(function(o) {
        c[o] = function() {
            console && console[o] && console[o].apply(console, arguments)
        }
    })(d[f]);
    var p = typeof a == "string" ? a: "chivoxAiDebug";
    for (f = e.length; --f >= 0;)(function(o, l) {
        c[l] = function() {
            var h = b.call(arguments),
                k = new Date;
            k = k.getHours() + ":" + k.getMinutes() + ":" + k.getSeconds() + "." + k.getMilliseconds();
            h.unshift(k);
            k = [l].concat(h);
            if (console && (g > 0 ? g > o: e.length + g <= o)) {
                try {
                    console.firebug ? console[l].apply(window, h) : console[l] ? console[l](h) : console.log(h)
                } catch(m) {}
                j.push(k);
                k = document.getElementById(p);
                if (k != null) {
                    var n = k.innerHTML;
                    n += '<div class="aiDebugBlock-' + l + '">';
                    n += '<span class="aiDebug-logType">[' + l + "]</span>";
                    for (var r = h.length,
                             q = 0; q < r; q++) {
                        n += '<span class="aiDebug-logText">';
                        n += typeof h[q] == "object" ? JSON.stringify(h[q]) : h[q];
                        n += "</span>"
                    }
                    n += "</div>";
                    k.innerHTML = n;
                    k.scrollTop = k.scrollHeight || k.offsetTop
                }
            }
        }
    })(f, e[f]);
    c.setLevel = function(o) {
        g = typeof o === "number" ? o: 9
    };
    c.getLogs = function() {
        return j
    };
    c.clear = function() {
        j = [];
        typeof console.clear == "function" && console.clear();
        var o = document.getElementById(p);
        if (o != null) o.innerHTML = ""
    };
    return c
};
chivox.AiFlashDetect = function() {
    var a = {
            hasFlash: false,
            version: "0",
            majorVersion: 0
        },
        b = swfobject.getFlashPlayerVersion();
    if (b && b.major != 0) {
        a.hasFlash = true;
        a.version = b.major + "." + b.minor + "." + b.release;
        a.majorVersion = b.major
    }
    return a
} ();
chivox.AiFlot = {
    point: 100,
    draw: function(a) {
        var b = [],
            c = typeof a.autoOffset != "undefined" ? a.autoOffset: true;
        typeof a.stdData != "undefined" && a.stdData.tone !== "" && a.stdData.color !== "" && b.push(this.__getStdPoint(a.stdData, c));
        typeof a.userData != "undefined" && a.userData.confidence !== "" && a.userData.color !== "" && b.push(this.__getUserPoint(a.userData, c));
        c = a.id;
        if (a.id.indexOf("#") < 0) c = "#" + a.id;
        var g = typeof a.width != "undefined" ? a.width: $(c).width();
        a = typeof a.height != "undefined" ? a.height: $(c).height();
        $(c).css({
            width: g,
            height: a
        });
        return $.plot($(c), b, {
            xaxis: {
                min: 0,
                max: 100,
                ticks: []
            },
            yaxis: {
                min: -50,
                max: 50,
                ticks: []
            },
            legend: {
                show: false
            },
            grid: {
                borderWidth: 0,
                labelMargin: 0
            }
        })
    },
    redraw: function(a, b) {
        var c = [],
            g = typeof b.autoOffset != "undefined" ? b.autoOffset: true;
        if (a == null) return null;
        typeof b.stdData != "undefined" && b.stdData.tone !== "" && b.stdData.color !== "" && c.push(this.__getStdPoint(b.stdData, g));
        typeof b.userData != "undefined" && b.userData.confidence !== "" && b.userData.color !== "" && c.push(this.__getUserPoint(b.userData, g));
        a.setData(c);
        a.draw();
        return a
    },
    __getStdPoint: function(a, b) {
        var c = [],
            g = chivox.AiTone.getStandardCurve(this.point, a.tone, 0, b);
        if (a.tone == 0 || a.tone == "") for (var e = 1; e <= this.point / 2; e++) c.push([e, g[e - 1]]);
        else for (e = 1; e <= this.point; e++) c.push([e, g[e - 1]]);
        return {
            data: c,
            color: a.color
        }
    },
    __getUserPoint: function(a, b) {
        var c = [],
            g = null;
        g = a.confidence;
        var e = 0,
            d = 0;
        for (e = 0; e < g.length; e++) if (g[e] >= g[d]) d = e;
        e = a.confidence;
        g = [];
        for (var f = 0; f < e.length; f++) g.push(e[f]);
        g = chivox.AiTone.getUserCurve(g, this.point, 0, 0, b);
        f = typeof a.offset == "number" ? a.offset: 30;
        if (d == 0) for (e = 1; e <= this.point / 2; e++) c.push([e, f + g[e - 1]]);
        else for (e = 1; e <= this.point; e++) c.push([e, f + g[e - 1]]);
        return {
            data: c,
            color: a.color
        }
    }
};
chivox.AiGChart = {
    point: 100,
    draw: function(a) {
        var b = [],
            c = typeof a.autoOffset != "undefined" ? a.autoOffset: true;
        typeof a.stdData != "undefined" && a.stdData.tone !== "" && a.stdData.color !== "" && b.push(this.__getStdPoint(a.stdData, c));
        typeof a.userData != "undefined" && a.userData.confidence !== "" && a.userData.color !== "" && b.push(this.__getUserPoint(a.userData, c));
        c = typeof a.width != "undefined" ? a.width: 200;
        for (var g = typeof a.height != "undefined" ? a.height: 200, e = [], d = [], f = 0; f < b.length; f++) {
            d.push(b[f].color.substring(1));
            e[f] = [];
            for (var j = b[f].data.length, p = 0; p < j; p++) {
                var o = parseFloat(b[f].data[p].toFixed(3));
                if (o > 100) o = -1;
                e[f].push(o)
            }
            for (p = j; p < this.point; p++) e[f].push( - 1)
        }
        console.log(e);
        b = "https://chart.googleapis.com/chart?chs=" + c + "x" + g + "&cht=ls&chco=" + d.join(",") + "&chd=t:" + e.join("|") + "&chf=bg,s,ffffff00";
        a = document.getElementById(a.id);
        if (a != null) a.innerHTML = '<img src="' + b + '" alt="" />';
        else return b;
        return a
    },
    __getStdPoint: function(a, b) {
        var c = [],
            g = chivox.AiTone.getStandardCurve(this.point, a.tone, 50, b);
        if (a.tone == 0 || a.tone == "") for (var e = 1; e <= this.point / 2; e++) c.push(g[e - 1]);
        else for (e = 1; e <= this.point; e++) c.push(g[e - 1]);
        return {
            color: a.color,
            data: c
        }
    },
    __getUserPoint: function(a, b) {
        var c = [],
            g = null;
        g = a.confidence;
        var e = 0,
            d = 0;
        for (e = 0; e < g.length; e++) if (g[e] >= g[d]) d = e;
        e = a.confidence;
        g = [];
        for (var f = 0; f < e.length; f++) g.push(e[f]);
        g = chivox.AiTone.getUserCurve(g, this.point, 0, 50, b);
        f = typeof a.offset == "number" ? a.offset: 30;
        if (d == 0) for (e = 1; e <= this.point / 2; e++) c.push(f + g[e - 1]);
        else for (e = 1; e <= this.point; e++) c.push(f + g[e - 1]);
        return {
            color: a.color,
            data: c
        }
    }
};
chivox.AiPanel = function(a) {
    function b() {
        h.playOff();
        ai$(f.play).unbind("click").click(function() {
            var k = this;
            if (d.player.canPlay) if (ai$(k).hasClass("playOn")) {
                h.playOff();
                d.player.reset()
            } else {
                if (typeof d.params.onBeforePlay == "function") d.params.onBeforePlay(k);
                d.resetStatus(k, null, null);
                h.playOn(k);
                d.player.load({
                    url: d.params.data.audioUrl,
                    success: function() {
                        ai$(k).hasClass("playOn") && d.player.play({
                            position: d.params.data.playPosition,
                            duration: d.params.data.playDuration,
                            onStart: function() {},
                            onStop: function() {
                                h.playOff();
                                if (typeof d.params.onAfterPlay == "function") d.params.onAfterPlay()
                            }
                        })
                    }
                })
            } else {
                p.open();
                h.playOff();
                if (typeof d.params.onError == "function") d.params.onError("PLAYER_NOT_READY")
            }
        })
    }
    function c(k) {
        if (d.lastRecordId != "") {
            if (typeof d.params.onBeforeScore == "function") d.params.onBeforeScore(k);
            d.recorder.getScores({
                recordId: d.lastRecordId,
                success: function(m) {
                    if (! (d.lastRecordId == "" || typeof m[d.lastRecordId] == "undefined")) {
                        d.scoreData[d.lastRecordId] = JSON.stringify(m[d.lastRecordId]);
                        ai$(k).parent().find(d.params.cssSelector.rateButton).show();
                        var n = m[d.lastRecordId].result;
                        if (typeof n == "undefined") {
                            if (typeof d.params.onScoreError == "function") {
                                m = m[d.lastRecordId].errId;
                                if (typeof m == "undefined") d.params.onScoreError("TIMEOUT", k);
                                else d.params.onScoreError(m, k)
                            }
                        } else if (n != null && (typeof n.err != "undefined" || typeof n.error != "undefined" || typeof n.errID != "undefined")) {
                            if (typeof d.params.onScoreError == "function") d.params.onScoreError(n.errID, k)
                        } else {
                            h.replayOff(ai$(k).parent().find(d.params.cssSelector.replay));
                            if (typeof d.params.onScore == "function") d.params.onScore(m[d.lastRecordId], k)
                        }
                    }
                }
            })
        } else if (typeof d.params.onScoreError == "function") d.params.onScoreError("NO_DATA")
    }
    function g() {
        h.recordOff();
        ai$(f.record).unbind("click").click(function() {
            var k = this;
            if (d.recorder.canRecord) {
                if (!ai$(this).hasClass("recordDisabled")) if (ai$(this).hasClass("recordOff")) {
                    d.lastRecordId = "";
                    ai$(k).attr("dataRecordId", "");
                    d.scoreData = {};
                    ai$(f.rateButton).hide();
                    d.resetStatus(null, k, null);
                    if (typeof d.params.onBeforeRecord == "function") d.params.onBeforeRecord(k);
                    var m = 2E3,
                        n = d.params.data.serverParams.coreType;
                    if (d.params.data.duration) m = d.params.data.duration;
                    else if (n == "cn.word.score" || n == "cn.sent.score") m = 2E3 + ai$.trim(d.params.data.serverParams.refText).split("-").length * 600;
                    else if (n == "en.word.score" || n == "en.sent.score") m = 2E3 + ai$.trim(d.params.data.serverParams.refText).split(" ").length * 600;
                    d.recorder.record({
                        duration: m,
                        playNotifyAudio: d.params.data.playNotifyAudio,
                        serverParams: d.params.data.serverParams,
                        onRecordIdGenerated: function(r, q) {
                            d.lastRecordId = q.recordId;
                            ai$(k).attr("dataRecordId", q.recordId);
                            if (typeof d.params.onRecordIdGenerated == "function") d.params.onRecordIdGenerated(r, q)
                        },
                        onStart: function() {
                            h.recordOn(k);
                            l.start(m, k);
                            if (typeof d.params.onRecordStart == "function") d.params.onRecordStart(k)
                        },
                        onStop: function() {
                            h.recordOff();
                            l.stop();
                            c(k);
                            if (typeof d.params.onAfterRecord == "function") d.params.onAfterRecord()
                        },
                        onInternalScore: function(r, q) {
                            if (typeof d.params.onInternalScore == "function") d.params.onInternalScore(q)
                        }
                    })
                } else {
                    l.stop();
                    h.recordOff();
                    d.recorder.stop({
                        onStop: function() {
                            if (typeof d.params.onAfterRecord == "function") d.params.onAfterRecord();
                            c(k)
                        }
                    })
                }
            } else {
                p.open();
                h.recordOff();
                h.replayDisabled();
                if (typeof d.params.onError == "function") d.params.onError("RECORDER_NOT_READY")
            }
        })
    }
    function e() {
        h.replayDisabled();
        ai$(f.replay).unbind("click").click(function() {
            var k = this;
            if (d.recorder.canRecord) {
                if (!ai$(this).hasClass("replayDisabled")) {
                    var m = ai$(this).parent().find(d.params.cssSelector.record).attr("dataRecordId");
                    if (m != "") if (ai$(this).hasClass("replayOff")) {
                        if (typeof d.params.onBeforeReplay == "function") d.params.onBeforeReplay();
                        d.resetStatus(null, null, k);
                        h.replayOn(k);
                        m = {
                            recordId: m,
                            onStop: function() {
                                h.replayOff(k);
                                if (typeof d.params.onAfterReplay == "function") d.params.onAfterReplay()
                            }
                        };
                        if (ai$("#replayStartPos")[0] && ai$("#replayStopPos")[0]) {
                            ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStartPos", ai$("#replayStartPos").val());
                            ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStopPos", ai$("#replayStopPos").val())
                        }
                        ai$("#replayExpand")[0] && ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayExpand", ai$("#replayExpand").val());
                        var n = ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStartPos"),
                            r = ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayStopPos"),
                            q = ai$(this).parent().find(d.params.cssSelector.record).attr("dataReplayExpand");
                        if (n && r) {
                            m.startPos = n;
                            m.stopPos = r
                        }
                        if (q) m.expand = q;
                        d.recorder.startReplay(m)
                    } else {
                        h.replayOff(k);
                        d.recorder.stopReplay({
                            onStop: function() {
                                if (typeof d.params.onAfterReplay == "function") d.params.onAfterReplay()
                            }
                        })
                    }
                }
            } else {
                h.recordOff();
                h.replayDisabled();
                p.open();
                if (typeof d.params.onError == "function") d.params.onError("RECORDER_NOT_READY")
            }
        })
    }
    var d = this;
    d.lastRecordId = "";
    d.scoreData = {};
    this.recorder = this.player = null;
    this.params = {
        appKey: "",
        secretKey: "",
        autoDetectNetwork: true,
        autoDetectMic: false,
        playerId: "player",
        recorderId: "recorder",
        dialogSelector: "#aiMediaDialog",
        dialogOverlaySelector: "#aiMediaDialogOverlay",
        cssSelectorAncestor: "#aiPanel",
        cssSelector: {
            play: ".play",
            record: ".record",
            replay: ".replay",
            rateButton: ".rateButton",
            recordProgressBar: ".recordProgressBar",
            dialogCloseButton: ".dialogCloseButton",
            dialogFlashError: ".dialogFlashError",
            dialogInfo: ".dialogInfo",
            okButton: ".okButton"
        },
        flashWmode: "transparent",
        language: "en_US",
        data: {
            audioUrl: "",
            playPosition: "",
            playDuration: "",
            duration: 0,
            playNotifyAudio: true,
            serverParams: ""
        },
        onRateError: function() {
            alert("\u8bf7\u5148\u5f55\u97f3\u518d\u8bc4\u8bba")
        },
        onDialogOpened: function() {},
        onDialogClosed: function() {},
        onBeforePlay: function() {},
        onAfterPlay: function() {},
        onBeforeRecord: function() {},
        onRecordStart: function() {},
        onAfterRecord: function() {},
        onRecordIdGenerated: function() {},
        onBeforeScore: function() {},
        onScore: function() {},
        onInternalScore: function() {},
        onScoreError: function() {},
        onBeforeReplay: function() {},
        onAfterReplay: function() {},
        onReset: function() {},
        onError: function() {},
        onPlayerError: function() {},
        onRecorderError: function() {}
    };
    typeof a != "undefined" && ai$.extend(d.params, a);
    var f = {
        panel: d.params.cssSelectorAncestor,
        play: d.params.cssSelectorAncestor + " " + d.params.cssSelector.play,
        record: d.params.cssSelectorAncestor + " " + d.params.cssSelector.record,
        replay: d.params.cssSelectorAncestor + " " + d.params.cssSelector.replay,
        recordProgressBar: d.params.cssSelector.recordProgressBar,
        rateButton: d.params.cssSelectorAncestor + " " + d.params.cssSelector.rateButton,
        dialogCloseButton: d.params.dialogSelector + " " + d.params.cssSelector.dialogCloseButton,
        dialogFlashError: d.params.dialogSelector + " " + d.params.cssSelector.dialogFlashError,
        dialogInfo: d.params.dialogSelector + " " + d.params.cssSelector.dialogInfo,
        okButton: d.params.dialogSelector + " " + d.params.cssSelector.okButton
    };
    this.selector = f;
    var j = {
        show: function(k) {
            var m = ["connectServerInit", "connectServerStart", "connectServerSuccess", "connectServerError"];
            if (ai$.inArray(k, m) > -1) for (var n in m) m.hasOwnProperty(n) != false && m[n] != k && j.hide(m[n]);
            m = ["micStatusAllow", "micStatusDisallow", "micStatusError", "mmscfgError"];
            if (ai$.inArray(k, m) > -1) for (n in m) m.hasOwnProperty(n) != false && m[n] != k && j.hide(m[n]);
            ai$(f.dialogInfo + " ." + k).show()
        },
        hide: function(k) {
            ai$(f.dialogInfo + " ." + k).hide()
        }
    };
    var p = this.Dialog = {
        open: function() {
            ai$(d.params.dialogOverlaySelector).show();
            if (chivox.AiFlashDetect.hasFlash == false) {
                ai$(f.dialogFlashError).find(".flashPlugin").show();
                ai$(f.dialogFlashError).show();
                ai$(f.dialogInfo).hide();
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed aiMediaDialogSuccess").addClass("aiMediaDialogError")
            } else if (parseFloat(chivox.AiFlashDetect.version) < 10.2) {
                ai$(f.dialogFlashError).find(".flashVersion").show();
                ai$(f.dialogFlashError).show();
                ai$(f.dialogInfo).hide();
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed aiMediaDialogSuccess").addClass("aiMediaDialogError")
            } else {
                ai$(f.dialogFlashError).hide();
                ai$(d.params.dialogSelector).removeClass("aiMediaDialogClosed aiMediaDialogError").addClass("aiMediaDialogSuccess");
                d.recorder.hideVolumeBar()
            }
            ai$(d.params.dialogSelector).show();
            if (typeof d.params.onDialogOpened == "function") d.params.onDialogOpened()
        },
        close: function() {
            ai$(d.params.dialogOverlaySelector).hide();
            ai$(f.dialogFlashError).hide();
            ai$(d.params.dialogSelector).removeClass("aiMediaDialogSuccess aiMediaDialogError").addClass("aiMediaDialogClosed");
            d.recorder.showVolumeBar();
            if (typeof d.params.onDialogClosed == "function") d.params.onDialogClosed()
        }
    };
    var o = this.Media = {
        createPlayer: function() {
            j.show("loadFlashPlayer");
            d.player = new chivox.AiPlayer({
                id: d.params.playerId,
                width: 1,
                height: 1,
                onFlashLoad: function() {
                    j.hide("loadFlashPlayer")
                },
                onError: function(k, m) {
                    if (typeof d.params.onPlayerError == "function") d.params.onPlayerError(k, m)
                }
            })
        },
        createRecorder: function() {
            j.show("loadFlashRecorder");
            j.show("connectServerInit");
            var k = {
                    id: d.params.recorderId,
                    appKey: d.params.appKey,
                    secretKey: d.params.secretKey,
                    wmode: d.params.flashWmode,
                    coreTimeout: d.params.coreTimeout || 6E4,
                    language: d.params.language,
                    jssdkVersion: chivox.jssdkVersion,
                    onFlashLoad: function() {
                        j.hide("loadFlashRecorder")
                    },
                    onMicStatusChange: function(q, s) {
                        if (q == "50001") j.show("micStatusAllow");
                        else if (q != "50008") {
                            if (q == "50002") j.show("micStatusDisallow");
                            else if (q == "50003") j.show("micStatusError");
                            else q == "50007" && j.show("mmscfgError");
                            d.params.autoDetectMic && p.open()
                        }
                        if (typeof d.params.onMicStatusChange == "function") d.params.onMicStatusChange(q, s)
                    },
                    onConnectorStatusChange: function(q, s) {
                        if (q == "50109") j.show("connectServerStart");
                        else if (q == "50100") j.show("connectServerSuccess");
                        else if (q == "50101" || q == "50103" || q == "50104" || q == "connection.disconnected") {
                            j.show("connectServerError");
                            d.recorder.reset();
                            l.hide();
                            l.reset();
                            h.recordOff();
                            h.replayDisabled();
                            q == "connection.disconnected" && j.show("connectServerInit");
                            d.params.autoDetectNetwork && p.open()
                        }
                        if (typeof d.params.onConnectorStatusChange == "function") d.params.onConnectorStatusChange(q, s)
                    },
                    onError: function(q, s) {
                        if (typeof d.params.onRecorderError == "function") d.params.onRecorderError(q, s)
                    }
                },
                m = ["connectLocalService", "urlListServiceUrl", "defaultAPIServiceUrlArray", "localServiceUrl", "latencyCheckServiceApplication"],
                n;
            for (n in m) {
                var r = m[n];
                if (typeof d.params[r] != "undefined") k[r] = d.params[r]
            }
            d.recorder = new chivox.AiRecorder(k)
        }
    }; (function() {
        o.createPlayer();
        o.createRecorder();
        ai$(f.rateButton).unbind("click").click(function() {
            var k = ai$(this).parent().find(d.params.cssSelector.record).attr("dataRecordId");
            if (k == "") {
                if (typeof d.params.onRateError == "function") d.params.onRateError()
            } else {
                var m = "ratePanel" + (new Date).getTime(),
                    n = "";
                n += '<div id="' + m + '" class="ratePopup">';
                n += "  <p>\u6211\u89c9\u5f97\u8fd9\u6b21\u8bc4\u5206\u592a\u4e0d\u51c6\u54e6\uff01</p>";
                n += '  <div class="feedbackForm">';
                n += '    <label>\u60a8\u7684\u90ae\u7bb1\uff1a<input class="email" type="text" name="email" value=""/></label><br/>';
                n += '    <label>* \u5907\u3000\u6ce8\uff1a<textarea class="feedback"></textarea></label><br/>';
                n += '    <div class="buttonTableDiv">';
                n += '      <table class="buttonTable" border="0" cellpadding="0" cellspacing="0"><tr>';
                n += '        <td align="center"><button class="submitButton">\u63d0\u4ea4</button></td>';
                n += '        <td align="center"><button class="cancelButton">\u53d6\u6d88</button></td>';
                n += "      </tr></table>";
                n += "    </div>";
                n += "  </div>";
                n += "</div>";
                ai$(f.panel).append(n);
                ai$("#" + m).show();
                ai$("#" + m).find(".submitButton").unbind("click").click(function() {
                    if (ai$.trim(ai$("#" + m + " .feedback").val()) == "") {
                        alert("\u8bf7\u5728\u5907\u6ce8\u4e2d\u63cf\u8ff0\u5177\u4f53\u7684\u4fe1\u606f");
                        return false
                    }
                    ai$("#" + m).hide();
                    ai$.ajax({
                        url: "http://api.chivox.com/sdk-monitor/monitor/recordFeedback",
                        type: "GET",
                        data: {
                            recordId: k,
                            email: ai$("#" + m + " .email").val(),
                            remarks: encodeURIComponent(ai$("#" + m + " .feedback").val())
                        },
                        dataType: "jsonp",
                        success: function() {
                            ai$("#" + m).remove()
                        }
                    })
                });
                ai$("#" + m).find(".cancelButton").unbind("click").click(function() {
                    ai$("#" + m).remove()
                })
            }
        });
        ai$(f.okButton).unbind("click").click(function() {
            p.close()
        });
        ai$(f.dialogCloseButton).unbind("click").click(function() {
            p.close()
        })
    })();
    var l = {
        __el: null,
        __duration: 0,
        __intervalId: null,
        __startTime: 0,
        __clear: function() {
            this.__startTime = this.__duration = 0;
            if (this.__intervalId != null) {
                window.clearInterval(this.__intervalId);
                this.__intervalId = null
            }
        },
        start: function(k, m) {
            var n = this;
            n.__clear();
            n.__duration = k;
            n.__el = m;
            n.__startTime = +new Date;
            var r = ai$(m).parent().find(f.recordProgressBar).width(),
                q = r / k;
            ai$(m).parent().find(f.recordProgressBar).show().find(".text").show();
            n.__intervalId = window.setInterval(function() {
                    var s = ( + new Date - n.__startTime) * q;
                    s >= r ? ai$(m).parent().find(f.recordProgressBar).find(".value").width("100%") : ai$(m).parent().find(f.recordProgressBar).find(".value").width(s)
                },
                100)
        },
        stop: function() {
            this.__clear();
            ai$(this.__el).parent().find(f.recordProgressBar).find(".text").hide();
            ai$(this.__el).parent().find(f.recordProgressBar).hide();
            ai$(this.__el).parent().find(f.recordProgressBar).find(".value").width("0%")
        },
        reset: function() {
            this.__clear();
            ai$(f.recordProgressBar).find(".value").width("0%")
        },
        hide: function() {
            ai$(f.recordProgressBar).find(".text").hide();
            ai$(f.recordProgressBar).hide()
        }
    };
    this.ProgressBar = l;
    var h = {
        playOff: function() {
            ai$(f.play).removeClass("playOn").addClass("playOff")
        },
        playOn: function(k) {
            typeof k != "undefined" ? ai$(k).removeClass("playOff").addClass("playOn") : ai$(f.play).removeClass("playOff").addClass("playOn")
        },
        recordOff: function() {
            ai$(f.record).removeClass("recordOn").addClass("recordOff")
        },
        recordOn: function(k) {
            typeof k != "undefined" ? ai$(k).removeClass("recordOff").addClass("recordOn") : ai$(f.record).removeClass("recordOff").addClass("recordOn")
        },
        replayDisabled: function(k) {
            typeof k != "undefined" ? ai$(k).removeClass("replayOff replayOn").addClass("replayDisabled").parent().find(d.params.cssSelector.record).attr("dataRecordId", "") : ai$(f.replay).removeClass("replayOff replayOn").addClass("replayDisabled").parent().find(d.params.cssSelector.record).attr("dataRecordId", "")
        },
        replayOff: function(k) {
            typeof k != "undefined" ? ai$(k).removeClass("replayDisabled replayOn").addClass("replayOff") : ai$(f.replay).removeClass("replayDisabled replayOn").addClass("replayOff")
        },
        replayOn: function(k) {
            typeof k != "undefined" ? ai$(k).removeClass("replayDisabled replayOff").addClass("replayOn") : ai$(f.replay).removeClass("replayDisabled replayOff").addClass("replayOn")
        }
    };
    d.resetStatus = function(k, m, n) {
        d.player.reset();
        d.recorder.reset();
        l.hide();
        l.reset();
        h.playOff();
        h.recordOff();
        if (typeof k == "undefined" && typeof m == "undefined" && typeof n == "undefined") h.replayDisabled();
        else {
            ai$(f.replay).each(function() {
                ai$(this).hasClass("replayDisabled") || h.replayOff(this)
            });
            typeof m != "undefined" && m != null && h.replayDisabled(ai$(m).parent().find(d.params.cssSelector.replay)[0])
        }
        if (typeof d.params.onReset == "function") d.params.onReset()
    };
    b();
    g();
    e();
    this.rebind = function() {
        b();
        g();
        e()
    }
};
chivox.AiPanel.prototype.setData = function(a) {
    this.lastRecordId = "";
    this.scoreData = {};
    ai$(this.selector.rateButton).hide();
    this.resetStatus();
    if (typeof a != "undefined") this.params.data = a
};
chivox.AiPanelParagraph = function(a) {
    this.aiPanel = a.aiPanel;
    this.replayPartIndex = this.recordPartIndex = this.playPartIndex = 0;
    this.onReset = a.onReset;
    this.selector = {
        play: "#playParagraph",
        record: "#recordParagraph",
        replay: "#replayParagraph",
        data: "#paragraphData"
    };
    this.lastRecordId = "";
    this.replayArr = {};
    this.playParams = {};
    this.recordParams = {};
    this.replayParams = {};
    this.replayTimeoutId = null
};
chivox.AiPanelParagraph.prototype.resetAllStatus = function(a) {
    var b = this;
    b.aiPanel.player.reset();
    if (typeof a == "undefined" || a == false) b.aiPanel.recorder.reset();
    else {
        b.aiPanel.recorder.stop();
        b.aiPanel.recorder.stopReplay();
        b.lastRecordId != "" &&
        function(c, g) {
            b.aiPanel.recorder.getScores({
                recordId: g,
                success: function(e) {
                    b.replayArr[c] = g;
                    if (typeof b.recordParams.onScore == "function") b.recordParams.onScore(e, g, c)
                }
            })
        } (b.recordPartIndex, b.lastRecordId)
    }
    b.playPartIndex = 0;
    b.recordPartIndex = 0;
    b.replayPartIndex = 0;
    if (b.replayTimeoutId != null) {
        window.clearTimeout(b.replayTimeoutId);
        b.replayTimeoutId = null
    }
    b.aiPanel.ProgressBar.hide();
    b.aiPanel.ProgressBar.reset();
    ai$(b.aiPanel.params.cssSelectorAncestor + " " + b.aiPanel.params.cssSelector.play).removeClass("playOn").addClass("playOff");
    ai$(b.selector.play).removeClass("playParagraphActive");
    ai$(b.selector.record).removeClass("recordParagraphActive");
    ai$(b.selector.replay).removeClass("replayParagraphActive");
    if (typeof b.onReset == "fucntion") b.onReset(a)
};
chivox.AiPanelParagraph.prototype.bindPlayEvent = function(a) {
    var b = this;
    b.playParams = a;
    ai$(b.selector.play).unbind("click").click(function() {
        var c = b.playParams.audioUrl;
        if (typeof b.playParams.onReset == "function") b.playParams.onReset();
        if (b.aiPanel.player.canPlay) if (ai$(this).hasClass("playParagraphActive")) {
            b.playPartIndex = 0;
            ai$(this).removeClass("playParagraphActive");
            if (typeof b.playParams.onStop == "function") b.playParams.onStop()
        } else {
            b.resetAllStatus();
            ai$(this).addClass("playParagraphActive");
            if (typeof b.playParams.onStart == "function") b.playParams.onStart();
            b.aiPanel.params.onBeforePlay = function() {
                b.aiPanel.params.data = {
                    audioUrl: c[b.playPartIndex]
                };
                if (typeof b.playParams.onBeforeStart == "function") b.playParams.onBeforeStart(b.playPartIndex)
            };
            b.aiPanel.params.onAfterPlay = function() {
                if (typeof b.playParams.onReset == "function") b.playParams.onReset();
                if (b.playPartIndex < c.length - 1) {
                    b.playPartIndex++;
                    ai$(b.aiPanel.selector.play).click()
                } else {
                    b.playPartIndex = 0;
                    ai$(b.selector.play).removeClass("playParagraphActive");
                    if (typeof b.playParams.onStop == "function") b.playParams.onStop()
                }
            }
        }
        ai$(b.aiPanel.selector.play).click()
    })
};
chivox.AiPanelParagraph.prototype.__startRecord = function() {
    var a = this;
    a.lastRecordId = "";
    if (typeof a.recordParams.onReset == "function") a.recordParams.onReset();
    var b = a.recordParams.serverParams[a.recordPartIndex],
        c = 2E3 + ai$.trim(b.refText).split(" ").length * 600;
    if (typeof a.recordParams.recordDuration != "undefined") if (a.recordParams.recordDuration[a.recordPartIndex]) c = a.recordParams.recordDuration[a.recordPartIndex];
    a.aiPanel.recorder.record({
        duration: c,
        playNotifyAudio: a.recordParams.playNotifyAudio,
        serverParams: b,
        onRecordIdGenerated: function(g, e) {
            a.lastRecordId = e.recordId
        },
        onStart: function() {
            a.aiPanel.ProgressBar.start(c, ai$(a.selector.record)[0]);
            if (typeof a.recordParams.onBeforeStart == "function") a.recordParams.onBeforeStart(a.recordPartIndex)
        },
        onStop: function() {
            a.stopRecord(false)
        }
    })
};
chivox.AiPanelParagraph.prototype.bindRecordEvent = function(a) {
    var b = this;
    b.recordParams = a;
    ai$(b.selector.record).unbind("click").click(function() {
        if (b.aiPanel.recorder.canRecord) if (ai$(this).hasClass("recordParagraphActive")) {
            b.aiPanel.recorder.stop();
            b.aiPanel.ProgressBar.stop();
            b.lastRecordId != "" &&
            function(c, g) {
                b.aiPanel.recorder.getScores({
                    recordId: g,
                    success: function(e) {
                        b.replayArr[c] = g;
                        if (typeof b.recordParams.onScore == "function") b.recordParams.onScore(e, g, c)
                    }
                })
            } (b.recordPartIndex, b.lastRecordId);
            b.recordPartIndex = 0;
            ai$(this).removeClass("recordParagraphActive");
            if (typeof b.recordParams.onReset == "function") b.recordParams.onReset();
            if (typeof b.recordParams.onStop == "function") b.recordParams.onStop()
        } else {
            b.resetAllStatus();
            b.replayArr = {};
            ai$(this).addClass("recordParagraphActive");
            if (typeof b.recordParams.onStart == "function") b.recordParams.onStart();
            b.__startRecord()
        } else ai$(b.aiPanel.selector.record).click()
    })
};
chivox.AiPanelParagraph.prototype.__startReplay = function() {
    var a = this,
        b = 0,
        c = 0,
        g;
    for (g in a.replayArr) if (a.replayArr.hasOwnProperty(g) != false) {
        if (c == a.replayPartIndex) {
            b = g;
            break
        }
        c++
    }
    if (typeof a.replayParams.onReset == "function") a.replayParams.onReset();
    a.aiPanel.recorder.startReplay({
        recordId: a.replayArr[b],
        onStart: function() {
            if (typeof a.replayParams.onBeforeStart == "function") a.replayParams.onBeforeStart(b)
        },
        onStop: function() {
            var e = 0,
                d;
            for (d in a.replayArr) a.replayArr.hasOwnProperty(d) != false && e++;
            if (a.replayPartIndex < e - 1) {
                if (a.replayTimeoutId != null) {
                    window.clearTimeout(a.replayTimeoutId);
                    a.replayTimeoutId = null
                }
                a.replayPartIndex++;
                a.replayTimeoutId = setTimeout(function() {
                        a.__startReplay()
                    },
                    100)
            } else {
                a.replayPartIndex = 0;
                ai$(a.selector.replay).removeClass("replayParagraphActive");
                if (typeof a.replayParams.onReset == "function") a.replayParams.onReset();
                if (typeof a.replayParams.onStop == "function") a.replayParams.onStop()
            }
        }
    })
};
chivox.AiPanelParagraph.prototype.bindReplayEvent = function(a) {
    var b = this;
    b.replayParams = a;
    ai$(b.selector.replay).unbind("click").click(function() {
        if (b.aiPanel.recorder.canRecord) {
            var c = 0,
                g;
            for (g in b.replayArr) b.replayArr.hasOwnProperty(g) != false && c++;
            if (c > 0) if (ai$(this).hasClass("replayParagraphActive")) {
                b.aiPanel.recorder.stopReplay();
                b.replayPartIndex = 0;
                ai$(this).removeClass("replayParagraphActive");
                if (typeof b.replayParams.onReset == "function") b.replayParams.onReset();
                if (typeof b.replayParams.onStop == "function") b.replayParams.onStop()
            } else {
                b.resetAllStatus();
                ai$(this).addClass("replayParagraphActive");
                if (typeof b.replayParams.onStart == "function") b.replayParams.onStart();
                b.__startReplay()
            }
        } else ai$(b.aiPanel.selector.record).click()
    })
};
chivox.AiPanelParagraph.prototype.stopRecord = function(a) {
    var b = this;
    b.aiPanel.recorder.stop();
    b.aiPanel.ProgressBar.stop();
    b.lastRecordId != "" &&
    function(c, g) {
        b.aiPanel.recorder.getScores({
            recordId: g,
            success: function(e) {
                b.replayArr[c] = g;
                if (typeof b.recordParams.onScore == "function") b.recordParams.onScore(e, g, c)
            }
        })
    } (b.recordPartIndex, b.lastRecordId);
    if (typeof a == "undefined" || a == false) if (b.recordPartIndex < b.recordParams.serverParams.length - 1) {
        b.recordPartIndex++;
        b.__startRecord()
    } else {
        b.recordPartIndex = 0;
        ai$(b.selector.record).removeClass("recordParagraphActive");
        if (typeof b.recordParams.onReset == "function") b.recordParams.onReset();
        if (typeof b.recordParams.onStop == "function") b.recordParams.onStop()
    } else {
        b.recordPartIndex = 0;
        ai$(b.selector.record).removeClass("recordParagraphActive");
        if (typeof b.recordParams.onReset == "function") b.recordParams.onReset();
        if (typeof b.recordParams.onStop == "function") b.recordParams.onStop()
    }
};
chivox.AiPlayer = function(a) {
    this.canPlay = false;
    this.params = {
        id: "aiPlayer",
        flashPlayerUrl: chivox.host + "/Resources/swf/AudioPlayer4JS_v3.2.5.swf",
        expressInstallUrl: chivox.host + "/Resources/swf/expressInstall.swf",
        isCache: true,
        width: 1,
        height: 1,
        wmode: "Opaque",
        appKey: "",
        secretKey: "",
        onFlashLoad: "",
        onError: ""
    };
    this.__extend(this.params, a);
    if (typeof jsReady == "undefined") {
        window.jsReady = false;
        window.jsIsReady = function() {
            return true
        }
    }
    this.aiDebug = new chivox.AiDebug;
    this.volume = 1;
    this.__synthStarted = false;
    chivox.AiPlayer.cache = chivox.AiPlayer.cache || {};
    chivox.AiPlayer.isConnectRtmpOK = chivox.AiPlayer.isConnectRtmpOK || false;
    var b = this;
    b.__playOrderState = "PLAY_INIT";
    chivox.AiPlayer.cache[b.params.id + "OnFlashLoad"] = function(e, d) {
        if (e === "50000") b.canPlay = true;
        if (typeof b.params.onFlashLoad == "function") {
            b.aiDebug.debug("flashLoadEventHandler", e, d);
            chivox.updateMonitorLog({
                applicationId: b.params.appKey,
                logType: "INSTANCELOG",
                logEvent: "AUDIOPLAYER4JSREADY",
                audioPlayer4JSReady: true,
                source: "SDK_JS"
            });
            window.setTimeout(function() {
                    b.params.onFlashLoad(e, d)
                },
                200)
        }
    };
    chivox.AiPlayer.cache[b.params.id + "OnPlayerStateChange"] = function(e, d) {
        if (e === "50414") {
            b.aiDebug.debug("playerEventHandler", e, d);
            if (typeof chivox.AiPlayer.cache[b.params.id + "LoadStartCallback"] == "function") chivox.AiPlayer.cache[b.params.id + "LoadStartCallback"](e, d)
        } else if (e === "50400") {
            b.aiDebug.debug("playerEventHandler", e, d);
            if (typeof chivox.AiPlayer.cache[b.params.id + "LoadSuccessCallback"] == "function") chivox.AiPlayer.cache[b.params.id + "LoadSuccessCallback"](e, d)
        } else if (e === "50401") {
            if (b.__playOrderState == "PLAY_CMD_START") {
                b.__playOrderState = "PLAY_ACT_START";
                b.aiDebug.debug("playerEventHandler", e, d);
                if (typeof chivox.AiPlayer.cache[b.params.id + "PlayOnStartCallback"] == "function") chivox.AiPlayer.cache[b.params.id + "PlayOnStartCallback"](e, d)
            }
        } else if (e === "50402") {
            b.__playOrderState = "PLAY_ACT_STOP";
            b.aiDebug.debug("playerEventHandler", e, d);
            if (d.stopType == "0") {
                if (typeof chivox.AiPlayer.cache[b.params.id + "PlayOnStopCallback"] == "function") chivox.AiPlayer.cache[b.params.id + "PlayOnStopCallback"](e, d)
            } else if (d.stopType == "1") if (typeof chivox.AiPlayer.cache[b.params.id + "ForcePlayOnStopCallback"] == "function") chivox.AiPlayer.cache[b.params.id + "ForcePlayOnStopCallback"](e, d)
        } else b.aiDebug.debug("UNREGISTERED playerEventHandler", e, d)
    };
    chivox.AiPlayer.cache[b.params.id + "OnError"] = function(e, d) {
        b.aiDebug.debug("errorEventHandler", e, d);
        if (e === "50409" || e === "50410") chivox.AiPlayer.cache[b.params.id + "LoadErrorCallback"](e, d);
        if (typeof b.params.onError == "function") b.params.onError(e, d)
    };
    a = {
        flashLoadEventHandler: "chivox.AiPlayer.cache." + b.params.id + "OnFlashLoad",
        onPlayerEventHandler: "chivox.AiPlayer.cache." + b.params.id + "OnPlayerStateChange",
        errorEventHandler: "chivox.AiPlayer.cache." + b.params.id + "OnError"
    };
    var c = {
            param: function(e) {
                var d = [],
                    f;
                for (f in e) e.hasOwnProperty(f) != false && d.push(f + "=" + e[f]);
                return d.join("&").replace(/%20/g, "+")
            }
        },
        g = b.params.flashPlayerUrl;
    if (b.params.isCache == false) g = g + "?guid=" + Math.random() * 99999999;
    if (navigator.platform.match(/inux/g) == "inux") {
        a = {
            movie: g,
            width: b.params.width,
            height: b.params.height,
            majorversion: "10",
            build: "0",
            id: b.params.id + "UFO",
            name: b.params.id + "UFO",
            wmode: b.params.wmode,
            allowscriptaccess: "always",
            flashvars: c.param(a)
        };
        UFO.create(a, b.params.id)
    } else swfobject.embedSWF(g, b.params.id, b.params.width, b.params.height, "10.0.0", b.params.expressInstallUrl, a, {
            allowScriptAccess: "always",
            wmode: b.params.wmode
        },
        {
            id: b.params.id,
            name: b.params.id,
            wmode: b.params.wmode
        })
};
chivox.AiPlayer.prototype.__extend = function(a, b) {
    if (Object.prototype.toString.call(a) === "[object Object]" && Object.prototype.toString.call(b) === "[object Object]") for (var c in b) if (b.hasOwnProperty(c) != false) a[c] = b[c]
};
chivox.AiPlayer.prototype.getAudioPlayer = function() {
    var a = null;
    try {
        a = navigator.platform.match(/inux/g) == "inux" ? document.getElementById(this.params.id + "UFO") : swfobject.getObjectById(this.params.id)
    } catch(b) {}
    return a
};
chivox.AiPlayer.prototype.reset = function() {
    typeof this.synthAjaxId != "undefined" && this.synthAjaxId.abort();
    if (this.__synthStarted) __synthStarted = false;
    var a = this.getPlayerStatus();
    if (a == "player.playing" || a == "player.bufferring") this.stop();
    this.__playOrderState = "PLAY_INIT"
};
chivox.AiPlayer.prototype.load = function(a) {
    var b = this,
        c = {
            url: "",
            appKey: "",
            secretKey: "",
            start: "",
            success: "",
            error: ""
        };
    b.__extend(c, a);
    c.appKey = c.appKey || b.params.appKey;
    c.secretKey = c.secretKey || b.params.secretKey;
    chivox.AiPlayer.cache[b.params.id + "LoadStartCallback"] = function(f, j) {
        typeof c.start == "function" && c.start(f, j);
        delete this[b.params.id + "LoadStartCallback"]
    };
    chivox.AiPlayer.cache[b.params.id + "LoadSuccessCallback"] = function(f, j) {
        typeof c.success == "function" && c.success(f, j);
        delete this[b.params.id + "LoadSuccessCallback"]
    };
    chivox.AiPlayer.cache[b.params.id + "LoadErrorCallback"] = function(f, j) {
        typeof c.error == "function" && c.error(f, j);
        delete this[b.params.id + "LoadErrorCallback"]
    };
    a = b.getAudioPlayer();
    var g = {};
    g.appKey = c.appKey;
    g.secretKey = c.secretKey;
    var e = {};
    try {
        e = a.loadAudioFromURL(c.url, g)
    } catch(d) {}
    b.aiDebug.debug("load", c, e);
    return e
};
chivox.AiPlayer.prototype.play = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_START";
    var c = {
        position: "",
        duration: "",
        onStart: "",
        onStop: ""
    };
    b.__extend(c, a);
    isNaN(c.position) && (c.position = "");
    isNaN(c.duration) && (c.duration = "");
    chivox.AiPlayer.cache[b.params.id + "PlayOnStartCallback"] = function(d, f) {
        if (typeof c.onStart == "function") c.onStart(d, f);
        delete this[b.params.id + "PlayOnStartCallback"]
    };
    chivox.AiPlayer.cache[b.params.id + "PlayOnStopCallback"] = function(d, f) {
        if (typeof c.onStop == "function") c.onStop(d, f)
    };
    a = {};
    if (c.duration === 0) {
        chivox.AiPlayer.cache[b.params.id + "PlayOnStartCallback"]();
        chivox.AiPlayer.cache[b.params.id + "PlayOnStopCallback"]();
        return a
    }
    var g = b.getAudioPlayer();
    try {
        a = g.startAudioPlay(c.position, c.duration, b.volume * 100)
    } catch(e) {}
    b.aiDebug.debug("play", c, a);
    return a
};
chivox.AiPlayer.prototype.stop = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_STOP";
    var c = {
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AiPlayer.cache[b.params.id + "ForcePlayOnStopCallback"] = function(d, f) {
        if (typeof c.onStop == "function") c.onStop(d, f);
        delete this[b.params.id + "ForcePlayOnStopCallback"]
    };
    a = {};
    var g = b.getAudioPlayer();
    try {
        a = g.stopAudioPlay()
    } catch(e) {}
    b.aiDebug.debug("stop", c, a);
    return a
};
chivox.AiPlayer.prototype.setVolume = function(a) {
    if (typeof a == "number" && isNaN(a) === false) {
        if (a < 0) a = 0;
        else if (a > 1) a = 1;
        this.volume = a;
        var b = this.getAudioPlayer();
        try {
            b.adjustVolume(a * 100)
        } catch(c) {}
    }
    this.aiDebug.debug("setVolume", this.volume);
    return this.volume
};
chivox.AiPlayer.prototype.getVolume = function() {
    var a = this.volume;
    this.aiDebug.debug("getVolume", a);
    return a
};
chivox.AiPlayer.prototype.getPosition = function() {
    var a = {},
        b = this.getAudioPlayer();
    try {
        a = b.getAudioCurrentTime()
    } catch(c) {}
    this.aiDebug.debug("getPosition", a);
    return a
};
chivox.AiPlayer.prototype.getDuration = function() {
    var a = {},
        b = this.getAudioPlayer();
    try {
        a = b.getAudioTotalTime()
    } catch(c) {}
    this.aiDebug.debug("getDuration", a);
    return a
};
chivox.AiPlayer.prototype.getPlayerStatus = function() {
    var a = "player.unready",
        b = this.getAudioPlayer();
    try {
        a = b.getPlayerStatus()
    } catch(c) {}
    this.aiDebug.debug("getPlayerStatus", a);
    return a
};
chivox.AiPlayer.prototype.synth = function(a) {
    if (! (typeof a == "undefined" || typeof a.ttsUrl == "undefined")) {
        var b = this,
            c = {
                isRefresh: false,
                synthHost: "http.api.chivox.com"
            };
        ai$.extend(c, a);
        c.isRefresh && delete b.synthData;
        b.__synthStarted = true;
        if (typeof b.synthData != "undefined") {
            if (typeof a.onGetSessionSuccess == "function") a.onGetSessionSuccess(b.synthData);
            b.__synthStartLoadAudio(c)
        } else b.synthAjaxId = ai$.ajax({
            cache: false,
            url: a.ttsUrl,
            dataType: "json",
            success: function(g) {
                if (g && typeof g.error == "undefined") {
                    b.synthData = g;
                    if (typeof a.onGetSessionSuccess == "function") a.onGetSessionSuccess(g);
                    b.__synthStartLoadAudio(c)
                } else if (typeof a.onGetSessionError == "function") a.onGetSessionError(g)
            },
            error: function() {
                if (typeof a.onGetSessionError == "function") a.onGetSessionError()
            }
        })
    }
};
chivox.AiPlayer.prototype.__synthStartLoadAudio = function(a) {
    var b = this,
        c = {
            applicationId: a.applicationId,
            session: b.synthData.session,
            lang: a.lang,
            text: encodeURIComponent(a.text),
            coreType: a.coreType,
            resource: a.resource
        },
        g = "",
        e = 0,
        d;
    for (d in c) if (c.hasOwnProperty(d) != false) {
        if (e != 0) g += "&";
        g += d + "=" + c[d];
        e++
    }
    b.load({
        url: "http://" + a.synthHost + "/api/v2.0/syn?" + g,
        success: function(f, j) {
            if (b.__synthStarted) {
                if (typeof a.onLoadSuccess == "function") a.onLoadSuccess(f, j);
                b.play({
                    position: "",
                    duration: "",
                    onStart: function(p, o) {
                        if (typeof a.onPlayStart == "function") a.onPlayStart(p, o)
                    },
                    onStop: function(p, o) {
                        b.__synthStarted = false;
                        if (typeof a.onPlayStop == "function") a.onPlayStop(p, o)
                    }
                })
            }
        },
        error: function(f, j) {
            if (typeof a.onLoadError == "function") a.onLoadError(f, j)
        }
    })
};
chivox.AiPlayer.prototype.stopSynth = function() {
    typeof this.synthAjaxId != "undefined" && this.synthAjaxId.abort();
    if (this.__synthStarted) this.__synthStarted = false;
    var a = this.getPlayerStatus();
    if (a == "player.playing" || a == "player.bufferring") this.stop()
};
chivox.AudioPlayer = function(a) {
    function b(d) {
        if (typeof d == "string") d = d.replace(/%22/g, '"').replace(/%5c/g, "\\").replace(/%26/g, "&").replace(/%25/g, "%");
        return d
    }
    this.canPlay = false;
    this.params = {
        id: "audioPlayer",
        flashPlayerUrl: chivox.host + "/Resources/swf/AudioPlayer4JS_v3.2.5.swf",
        expressInstallUrl: chivox.host + "/Resources/swf/expressInstall.swf",
        isCache: true,
        width: 1,
        height: 1,
        wmode: "Opaque",
        appKey: "",
        secretKey: "",
        playerType: "MP3Player",
        onFlashLoad: "",
        onError: ""
    };
    this.__extend(this.params, a);
    if (typeof jsReady == "undefined") {
        window.jsReady = true;
        window.jsIsReady = function() {
            return true
        }
    }
    this.aiDebug = new chivox.AiDebug;
    this.volume = 1;
    chivox.AudioPlayer.cache = chivox.AudioPlayer.cache || {};
    chivox.AudioPlayer.isConnectRtmpOK = chivox.AudioPlayer.isConnectRtmpOK || false;
    var c = this;
    c.__playOrderState = "PLAY_INIT";
    chivox.AudioPlayer.cache[c.params.id + "OnFlashLoad"] = function(d, f) {
        f = b(f);
        if (d === "50000") c.canPlay = true;
        if (typeof c.params.onFlashLoad == "function") {
            c.aiDebug.debug("flashLoadEventHandler", d, f);
            chivox.updateMonitorLog({
                applicationId: c.params.appKey,
                logType: "INSTANCELOG",
                logEvent: "AUDIOPLAYER4JSREADY",
                audioPlayer4JSReady: true,
                source: "SDK_JS"
            });
            window.setTimeout(function() {
                    c.params.onFlashLoad(d, f)
                },
                200)
        }
    };
    chivox.AudioPlayer.cache[c.params.id + "OnPlayerStateChange"] = function(d, f) {
        f = b(f);
        var j = null;
        j = typeof f == "string" ? JSON.parse(f) : f;
        if (d === "50414") {
            c.aiDebug.debug("playerEventHandler", d, f);
            if (typeof chivox.AudioPlayer.cache[c.params.id + "LoadStartCallback"] == "function") chivox.AudioPlayer.cache[c.params.id + "LoadStartCallback"](d, j)
        } else if (d === "50400") {
            c.aiDebug.debug("playerEventHandler", d, f);
            if (typeof chivox.AudioPlayer.cache[c.params.id + "LoadSuccessCallback"] == "function") chivox.AudioPlayer.cache[c.params.id + "LoadSuccessCallback"](d, j)
        } else if (d === "50401") {
            if (c.__playOrderState == "PLAY_CMD_START") {
                c.__playOrderState = "PLAY_ACT_START";
                c.aiDebug.debug("playerEventHandler", d, f);
                if (typeof chivox.AudioPlayer.cache[c.params.id + "PlayOnStartCallback"] == "function") chivox.AudioPlayer.cache[c.params.id + "PlayOnStartCallback"](d, j)
            }
        } else if (d === "50402") {
            c.__playOrderState = "PLAY_ACT_STOP";
            c.aiDebug.debug("playerEventHandler", d, f);
            if (j.stopType == "stop.auto") {
                if (typeof chivox.AudioPlayer.cache[c.params.id + "PlayOnStopCallback"] == "function") chivox.AudioPlayer.cache[c.params.id + "PlayOnStopCallback"](d, j)
            } else if (j.stopType == "stop.manual") if (typeof chivox.AudioPlayer.cache[c.params.id + "ForcePlayOnStopCallback"] == "function") chivox.AudioPlayer.cache[c.params.id + "ForcePlayOnStopCallback"](d, j)
        } else c.aiDebug.debug("UNREGISTERED playerEventHandler", d, f)
    };
    chivox.AudioPlayer.cache[c.params.id + "OnError"] = function(d, f) {
        f = b(f);
        c.aiDebug.debug("errorEventHandler", d, f);
        if (d === "50409" || d === "50410") chivox.AudioPlayer.cache[c.params.id + "LoadErrorCallback"](d, f);
        if (typeof c.params.onError == "function") c.params.onError(d, f)
    };
    a = {
        playerType: c.params.playerType,
        flashLoadEventHandler: "chivox.AudioPlayer.cache." + c.params.id + "OnFlashLoad",
        onPlayerEventHandler: "chivox.AudioPlayer.cache." + c.params.id + "OnPlayerStateChange",
        errorEventHandler: "chivox.AudioPlayer.cache." + c.params.id + "OnError"
    };
    var g = {
            param: function(d) {
                var f = [],
                    j;
                for (j in d) d.hasOwnProperty(j) != false && f.push(j + "=" + d[j]);
                return f.join("&").replace(/%20/g, "+")
            }
        },
        e = c.params.flashPlayerUrl;
    if (c.params.isCache == false) e = e + "?guid=" + Math.random() * 99999999;
    if (navigator.platform.match(/inux/g) == "inux") {
        a = {
            movie: e,
            width: c.params.width,
            height: c.params.height,
            majorversion: "10",
            build: "0",
            id: c.params.id + "UFO",
            name: c.params.id + "UFO",
            wmode: c.params.wmode,
            allowscriptaccess: "always",
            flashvars: g.param(a)
        };
        UFO.create(a, c.params.id)
    } else swfobject.embedSWF(e, c.params.id, c.params.width, c.params.height, "10.0.0", c.params.expressInstallUrl, a, {
            allowScriptAccess: "always",
            wmode: c.params.wmode
        },
        {
            id: c.params.id,
            name: c.params.id,
            wmode: c.params.wmode
        })
};
chivox.AudioPlayer.prototype.__extend = function(a, b) {
    if (Object.prototype.toString.call(a) === "[object Object]" && Object.prototype.toString.call(b) === "[object Object]") for (var c in b) if (b.hasOwnProperty(c) != false) a[c] = b[c]
};
chivox.AudioPlayer.prototype.getAudioPlayer = function() {
    var a = null;
    try {
        a = navigator.platform.match(/inux/g) == "inux" ? document.getElementById(this.params.id + "UFO") : swfobject.getObjectById(this.params.id)
    } catch(b) {}
    return a
};
chivox.AudioPlayer.prototype.reset = function() {
    typeof this.synthAjaxId != "undefined" && this.synthAjaxId.abort();
    var a = this.getPlayerStatus();
    if (a == "player.playing" || a == "player.bufferring") this.stop();
    this.__playOrderState = "PLAY_INIT"
};
chivox.AudioPlayer.prototype.load = function(a) {
    var b = this,
        c = {
            start: "",
            success: "",
            error: ""
        };
    b.__extend(c, a);
    chivox.AudioPlayer.cache[b.params.id + "LoadStartCallback"] = function(d, f) {
        typeof c.start == "function" && c.start(d, f);
        delete this[b.params.id + "LoadStartCallback"]
    };
    chivox.AudioPlayer.cache[b.params.id + "LoadSuccessCallback"] = function(d, f) {
        typeof c.success == "function" && c.success(d, f);
        delete this[b.params.id + "LoadSuccessCallback"]
    };
    chivox.AudioPlayer.cache[b.params.id + "LoadErrorCallback"] = function(d, f) {
        typeof c.error == "function" && c.error(d, f);
        delete this[b.params.id + "LoadErrorCallback"]
    };
    a = b.getAudioPlayer();
    var g = {};
    try {
        g = typeof c.url != "undefined" ? a.loadAudioFromURL(c.url) : a.loadAudioFromByteArray(c.byteData)
    } catch(e) {}
    b.aiDebug.debug("load", c, g);
    return g
};
chivox.AudioPlayer.prototype.play = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_START";
    var c = {
        position: "",
        duration: "",
        onStart: "",
        onStop: ""
    };
    b.__extend(c, a);
    isNaN(c.position) && (c.position = "");
    isNaN(c.duration) && (c.duration = "");
    chivox.AudioPlayer.cache[b.params.id + "PlayOnStartCallback"] = function(d, f) {
        if (typeof c.onStart == "function") c.onStart(d, f);
        delete this[b.params.id + "PlayOnStartCallback"]
    };
    chivox.AudioPlayer.cache[b.params.id + "PlayOnStopCallback"] = function(d, f) {
        if (typeof c.onStop == "function") c.onStop(d, f)
    };
    a = {};
    if (c.duration === 0) {
        chivox.AudioPlayer.cache[b.params.id + "PlayOnStartCallback"]();
        chivox.AudioPlayer.cache[b.params.id + "PlayOnStopCallback"]();
        return a
    }
    var g = b.getAudioPlayer();
    try {
        a = g.startAudioPlay(c.position, c.duration)
    } catch(e) {}
    b.aiDebug.debug("play", c, a);
    return a
};
chivox.AudioPlayer.prototype.stop = function(a) {
    var b = this;
    b.__playOrderState = "PLAY_CMD_STOP";
    var c = {
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AudioPlayer.cache[b.params.id + "ForcePlayOnStopCallback"] = function(d, f) {
        if (typeof c.onStop == "function") c.onStop(d, f);
        delete this[b.params.id + "ForcePlayOnStopCallback"]
    };
    a = {};
    var g = b.getAudioPlayer();
    try {
        a = g.stopAudioPlay()
    } catch(e) {}
    b.aiDebug.debug("stop", c, a);
    return a
};
chivox.AudioPlayer.prototype.setVolume = function(a) {
    if (typeof a == "number" && isNaN(a) === false) {
        if (a < 0) a = 0;
        else if (a > 1) a = 1;
        this.volume = a;
        var b = this.getAudioPlayer();
        try {
            b.adjustVolume(a * 100)
        } catch(c) {}
    }
    this.aiDebug.debug("setVolume", this.volume);
    return this.volume
};
chivox.AudioPlayer.prototype.getVolume = function() {
    var a = this.volume;
    this.aiDebug.debug("getVolume", a);
    return a
};
chivox.AudioPlayer.prototype.getPosition = function() {
    var a = {},
        b = this.getAudioPlayer();
    try {
        a = b.getAudioCurrentTime()
    } catch(c) {}
    this.aiDebug.debug("getPosition", a);
    return a
};
chivox.AudioPlayer.prototype.getDuration = function() {
    var a = {},
        b = this.getAudioPlayer();
    try {
        a = b.getAudioTotalTime()
    } catch(c) {}
    this.aiDebug.debug("getDuration", a);
    return a
};
chivox.AudioPlayer.prototype.getPlayerStatus = function() {
    var a = "player.unready",
        b = this.getAudioPlayer();
    try {
        a = b.getPlayerStatus()
    } catch(c) {}
    this.aiDebug.debug("getPlayerStatus", a);
    return a
};
chivox.AiRecorder = function(a) {
    function b(l) {
        if (typeof l == "string") l = l.replace(/%22/g, '"').replace(/%5c/g, "\\").replace(/%26/g, "&").replace(/%25/g, "%");
        return l
    }
    this.canRecord = false;
    this.params = {
        id: "aiRecorder",
        flashRecorderUrl: chivox.host + "/Resources/swf/AudioRecorder4JS_v3.2.5.swf",
        expressInstallUrl: chivox.host + "/Resources/swf/expressInstall.swf",
        isCache: true,
        width: 220,
        height: 140,
        wmode: "Opaque",
        backgroundColor: "0x00ffffff",
        showFlash: true,
        appKey: "",
        secretKey: "",
        userId: "guest",
        onFlashLoad: "",
        onConnectorStatusChange: "",
        onMicStatusChange: "",
        onError: "",
        coreTimeout: 6E4,
        logLevel: "DEBUG",
        logTarget: "1",
        language: "en_US"
    };
    this.__extend(this.params, a);
    if (navigator.platform.match(/inux/g) == "inux") this.params.wmode = "Window";
    if (typeof jsReady == "undefined") {
        window.jsReady = false;
        window.jsIsReady = function() {
            return true
        }
    }
    this.aiDebug = new chivox.AiDebug;
    this.recordIdArr = [];
    this.result = {};
    this.__getScoreTimeoutId = [];
    this.__getScoreTimeoutStartTime = 0;
    this.currentView = {
        meter: {
            x: 0,
            y: -25,
            visible: true
        },
        slider: {
            x: 0,
            y: 20,
            visible: true
        },
        viewer: {
            x: 0,
            y: 0,
            visible: false
        }
    };
    this.noView = {
        meter: {
            x: 0,
            y: -25,
            visible: false
        },
        slider: {
            x: 0,
            y: 20,
            visible: false
        },
        viewer: {
            x: 0,
            y: 0,
            visible: false
        }
    };
    chivox.AiRecorder.cache = chivox.AiRecorder.cache || {};
    var c = this;
    c.__recordOrderState = "RECORD_INIT";
    c.__replayOrderState = "REPLAY_INIT";
    c.canRecordCheck = {
        flashLoaded: false,
        serverConnected: false,
        micAllowed: false,
        refresh: function() {
            c.canRecord = c.canRecordCheck.flashLoaded && c.canRecordCheck.serverConnected && c.canRecordCheck.micAllowed ? true: false
        }
    };
    chivox.AiRecorder.cache[c.params.id + "OnFlashLoad"] = function(l, h) {
        h = b(h);
        c.aiDebug.debug("flashLoadEventHandler", l, h);
        if (l === "50000") {
            c.canRecordCheck.flashLoaded = true;
            c.canRecordCheck.refresh()
        }
        if (typeof h == "string") h = JSON.parse(h);
        setTimeout(function() {
                if (c.params.showFlash == true) c.canRecordCheck.micAllowed ? c.showVolumeBar(c.currentView, false) : c.showVolumeBar(c.noView, false)
            },
            200);
        typeof c.params.onFlashLoad == "function" && window.setTimeout(function() {
                c.params.onFlashLoad(l, h)
            },
            200)
    };
    chivox.AiRecorder.cache[c.params.id + "OnConnectorStatusChange"] = function(l, h) {
        h = b(h);
        if (l == "50109") c.canRecordCheck.serverConnected = false;
        else if (l == "50100") c.canRecordCheck.serverConnected = true;
        else if (l == "50101" || l == "50103" || l == "50104") c.canRecordCheck.serverConnected = false;
        else if (l == "connection.disconnected") c.canRecordCheck.serverConnected = false;
        c.canRecordCheck.refresh();
        c.aiDebug.debug("connectorEventHandler", l, h);
        if (typeof h == "string") h = JSON.parse(h);
        typeof c.params.onConnectorStatusChange == "function" && window.setTimeout(function() {
                c.params.onConnectorStatusChange(l, h)
            },
            200)
    };
    chivox.AiRecorder.cache[c.params.id + "OnMicStatusChange"] = function(l, h) {
        h = b(h);
        if (l == "50001") {
            c.canRecordCheck.micAllowed = true;
            c.showVolumeBar(c.currentView, false)
        } else if (l == "50002") {
            c.canRecordCheck.micAllowed = false;
            c.showVolumeBar(c.noView, false)
        } else if (l == "50003") {
            c.canRecordCheck.micAllowed = false;
            c.showVolumeBar(c.noView, false)
        }
        c.canRecordCheck.refresh();
        c.aiDebug.debug("micEventHandler", l, h);
        if (typeof h == "string") h = JSON.parse(h);
        typeof c.params.onMicStatusChange == "function" && window.setTimeout(function() {
                c.params.onMicStatusChange(l, h)
            },
            200)
    };
    chivox.AiRecorder.cache[c.params.id + "OnFactoryStateChange"] = function(l, h) {
        h = b(h);
        c.aiDebug.debug("factoryEventHandler", l, h);
        if (typeof h == "string") h = JSON.parse(h);
        if (l == "50500") chivox.AiRecorder.cache[c.params.id + "OnConnectorStatusChange"]("50100", h);
        else if (l == "50501") chivox.AiRecorder.cache[c.params.id + "OnConnectorStatusChange"]("50104", h)
    };
    chivox.AiRecorder.cache[c.params.id + "OnRecorderStateChange"] = function(l, h) {
        h = b(h);
        var k = null;
        k = typeof h == "string" ? JSON.parse(h) : h;
        if (l == "50304") {
            c.aiDebug.debug("recorderEventHandler", l, h);
            if (typeof chivox.AiRecorder.cache[c.params.id + "RecordIdGetted"] == "function") chivox.AiRecorder.cache[c.params.id + "RecordIdGetted"](l, k)
        } else if (l == "50300") {
            c.__recordOrderState = "RECORD_ACT_STOP";
            c.aiDebug.debug("recorderEventHandler", l, h);
            chivox.AiRecorder.cache[c.params.id + "StartGetScoreTimeStamp"] = (new Date).getTime();
            if (k.stopType == "stop.auto") chivox.AiRecorder.cache[c.params.id + "RecordOnStop"](l, k);
            else if (k.stopType == "stop.manually") chivox.AiRecorder.cache[c.params.id + "ForceRecordOnStop"](l, k)
        } else if (l === "50301") {
            if (c.__recordOrderState == "RECORD_CMD_START") {
                c.__recordOrderState = "RECORD_ACT_START";
                c.aiDebug.debug("recorderEventHandler", l, h);
                chivox.AiRecorder.cache[c.params.id + "RecordOnStart"](l, k)
            }
        } else if (l == "50302") {
            c.__replayOrderState = "REPLAY_ACT_STOP";
            c.aiDebug.debug("recorderEventHandler", l, h);
            if (k.stopType === "stop.auto") chivox.AiRecorder.cache[c.params.id + "ReplayOnStop"](l, k);
            else if (k.stopType === "stop.manually") chivox.AiRecorder.cache[c.params.id + "ForceReplayOnStop"](l, k)
        } else if (l === "50303") {
            if (c.__replayOrderState == "REPLAY_CMD_START") {
                c.__replayOrderState = "REPLAY_ACT_START";
                c.aiDebug.debug("recorderEventHandler", l, h);
                chivox.AiRecorder.cache[c.params.id + "ReplayOnStart"](l, k)
            }
        } else c.aiDebug.debug("UNREGISTERED recorderEventHandler", l, h)
    };
    chivox.AiRecorder.cache[c.params.id + "OnCoreRequesterCallback"] = function(l, h, k) {
        h = b(h);
        c.aiDebug.debug("coreRequesterEventHandler", l, h, k);
        if (typeof h == "string") h = JSON.parse(h);
        if (l === "50200") {
            if ((typeof h["Stream-Mode"] != "undefined" || typeof h.tokenId != "undefined") && ai$.isEmptyObject(k)) if (typeof chivox.AiRecorder.cache[c.params.id + "RecordOnScore"] == "function") chivox.AiRecorder.cache[c.params.id + "RecordOnScore"](l, h);
            if (typeof h.result == "string") h.result = JSON.parse(h.result);
            if (h.tokenId != "" && h.eof == 1) c.result[h.tokenId] = h;
            else if (typeof chivox.AiRecorder.cache[c.params.id + "onInternalScore"] == "function") chivox.AiRecorder.cache[c.params.id + "onInternalScore"](l, h);
            if (typeof chivox.AiRecorder.cache[c.params.id + "PRCSuccess"] == "function") chivox.AiRecorder.cache[c.params.id + "PRCSuccess"](l, h, k)
        } else if (l == "50203") if (typeof chivox.AiRecorder.cache[c.params.id + "PRCRequestIdGenerated"] == "function") chivox.AiRecorder.cache[c.params.id + "PRCRequestIdGenerated"](l, h, k)
    };
    chivox.AiRecorder.cache[c.params.id + "OnError"] = function(l, h) {
        h = b(h);
        c.aiDebug.debug("errorEventHandler", l, h);
        if (typeof h == "string") h = JSON.parse(h);
        if (l === "50201") {
            if (typeof c.result[h.tokenId] == "undefined") c.result[h.tokenId] = {
                recordId: h.tokenId
            }
        } else if (l === "50202") if (typeof h.tokenId != "undefined") {
            if (typeof c.result[h.tokenId] == "undefined") c.result[h.tokenId] = h
        } else {
            if (typeof chivox.AiRecorder.cache[c.params.id + "PRCError"] == "function") chivox.AiRecorder.cache[c.params.id + "PRCError"](l, h)
        } else if (l === "50104") if (typeof c.params.onConnectorStatusChange == "function") c.params.onConnectorStatusChange(l, h);
        if (typeof c.params.onError == "function") c.params.onError(l, h)
    };
    a = {
        showFlash: c.params.showFlash,
        backgroundColor: c.params.backgroundColor,
        flashLoadEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnFlashLoad",
        connectorEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnConnectorStatusChange",
        coreRequesterEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnCoreRequesterCallback",
        micEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnMicStatusChange",
        recorderEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnRecorderStateChange",
        factoryEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnFactoryStateChange",
        errorEventHandler: "chivox.AiRecorder.cache." + c.params.id + "OnError",
        coreTimeout: c.params.coreTimeout,
        logLevel: c.params.logLevel,
        logTarget: c.params.logTarget,
        appKey: c.params.appKey,
        secretKey: c.params.secretKey,
        language: c.params.language,
        userId: c.params.userId,
        jssdkVersion: c.params.jssdkVersion
    };
    var g = ["connectLocalService", "urlListServiceUrl", "defaultAPIServiceUrlArray", "localServiceUrl", "latencyCheckServiceApplication"],
        e;
    for (e in g) {
        var d = g[e];
        if (typeof c.params[d] != "undefined") a[d] = c.params[d]
    }
    e = chivox.LocationSearch.get();
    if (e.__airecorder) {
        e = e.__airecorder;
        try {
            var f = JSON.parse(decodeURIComponent(e)),
                j;
            for (j in f) f.hasOwnProperty(j) == false || typeof f[j] === "undefined" || (a[j] = f[j])
        } catch(p) {
            c.aiDebug.debug("Invalid __airecorder params.")
        }
    }
    f = {
        param: function(l) {
            var h = [],
                k;
            for (k in l) l.hasOwnProperty(k) == false || typeof l[k] === "undefined" || h.push(k + "=" + l[k]);
            return h.join("&").replace(/%20/g, "+")
        }
    };
    if (c.params.isCache == false) c.params.flashRecorderUrl = c.params.flashRecorderUrl + "?guid=" + Math.random() * 99999999;
    if (navigator.platform.match(/inux/g) == "inux") {
        var o = {
            movie: c.params.flashRecorderUrl,
            width: c.params.width,
            height: c.params.height,
            majorversion: "10",
            build: "0",
            id: c.params.id + "UFO",
            name: c.params.id + "UFO",
            wmode: c.params.wmode,
            allowscriptaccess: "always",
            flashvars: f.param(a)
        };
        UFO.create(o, c.params.id)
    } else {
        f = {
            allowScriptAccess: "always",
            wmode: c.params.wmode
        };
        j = {
            id: c.params.id,
            name: c.params.id,
            wmode: c.params.wmode
        };
        for (o in a) typeof a[o] === "undefined" && delete a[o];
        swfobject.embedSWF(c.params.flashRecorderUrl, c.params.id, c.params.width, c.params.height, "10.0.0", c.params.expressInstallUrl, a, f, j)
    }
};
chivox.AiRecorder.prototype.__extend = function(a, b) {
    if (Object.prototype.toString.call(a) === "[object Object]" && Object.prototype.toString.call(b) === "[object Object]") for (var c in b) if (b.hasOwnProperty(c) != false) a[c] = b[c]
};
chivox.AiRecorder.prototype.getLastRecordId = function() {
    var a = null,
        b = this.recordIdArr.length;
    if (b > 0) a = this.recordIdArr[b - 1];
    this.aiDebug.debug("getLastRecordId", a);
    return a
};
chivox.AiRecorder.prototype.getAudioRecorder = function() {
    var a = null;
    try {
        a = navigator.platform.match(/inux/g) == "inux" ? document.getElementById(this.params.id + "UFO") : swfobject.getObjectById(this.params.id)
    } catch(b) {}
    return a
};
chivox.AiRecorder.prototype.reset = function() {
    this.aiDebug.debug("AiRecorder.reset: this will clearTimeout in getScores.");
    for (var a in this.__getScoreTimeoutId) this.__getScoreTimeoutId.hasOwnProperty(a) != false && window.clearTimeout(this.__getScoreTimeoutId[a]);
    this.__getScoreTimeoutId = [];
    this.__getScoreTimeoutStartTime = 0;
    a = this.getRecorderStatus();
    if (a == "recorder.recording" || a == "recorder.waiting.to.start.recording") this.stop();
    else a == "recorder.replaying" && this.stopReplay();
    this.__recordOrderState = "RECORD_INIT";
    this.__replayOrderState = "REPLAY_INIT"
};
chivox.AiRecorder.prototype.record = function(a) {
    var b = this;
    b.__recordOrderState = "RECORD_CMD_START";
    var c = {
        duration: 5E3,
        playNotifyAudio: true,
        serverParams: {},
        onRecordIdGenerated: "",
        onStart: "",
        onStop: "",
        onScore: "",
        onInternalScore: ""
    };
    b.__extend(c, a);
    isNaN(c.duration) === true && (c.duration = 5E3);
    typeof c.playNotifyAudio != "boolean" && (c.playNotifyAudio = true);
    if (c.serverParams.coreType == "en.word.score" || c.serverParams.coreType == "en.sent.score" || c.serverParams.coreType == "en.sent.recscore" || c.serverParams.coreType == "cn.word.score" || c.serverParams.coreType == "cn.sent.score") {
        a = 100;
        if (typeof c.serverParams.scoreType != "undefined") a = c.serverParams.scoreType;
        if (typeof c.serverParams.rank != "undefined") a = c.serverParams.rank;
        c.serverParams.rank = c.serverParams.scoreType = a
    } else if (c.serverParams.coreType == "en.sent.rec") c.serverParams.language = "english";
    else if (c.serverParams.coreType == "cn.sent.rec") c.serverParams.language = "chinese";
    if (typeof c.serverParams.userId == "undefined") c.serverParams.userId = b.params.userId;
    chivox.AiRecorder.cache[b.params.id + "RecordIdGetted"] = function(f, j) {
        j.recordId = j.tokenId;
        b.recordIdArr.push(j.tokenId);
        if (typeof c.onRecordIdGenerated == "function") c.onRecordIdGenerated(f, j)
    };
    chivox.AiRecorder.cache[b.params.id + "RecordOnStart"] = function(f, j) {
        if (typeof c.onStart == "function") c.onStart(f, j)
    };
    chivox.AiRecorder.cache[b.params.id + "RecordOnStop"] = function(f, j) {
        if (typeof c.onStop == "function") c.onStop(f, j)
    };
    chivox.AiRecorder.cache[b.params.id + "RecordOnScore"] = function(f, j) {
        if (typeof c.onScore == "function") c.onScore(f, j)
    };
    chivox.AiRecorder.cache[b.params.id + "onInternalScore"] = function(f, j) {
        if (typeof c.onInternalScore == "function") c.onInternalScore(f, j)
    };
    a = {
        serverParam: c.serverParams,
        recordLength: c.duration,
        virtualDirectory: "",
        isVADEnabled: false,
        silenceLevel: "0",
        playDing: c.playNotifyAudio
    };
    var g = {},
        e = b.getAudioRecorder();
    try {
        g = e.startRecord(a)
    } catch(d) {}
    b.aiDebug.debug("record", c, g);
    return g
};
chivox.AiRecorder.prototype.stop = function(a) {
    var b = this;
    b.__recordOrderState = "RECORD_CMD_STOP";
    var c = {
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AiRecorder.cache[b.params.id + "ForceRecordOnStop"] = function(f, j) {
        if (typeof c.onStop == "function") c.onStop(f, j);
        delete this[b.params.id + "ForceRecordOnStop"]
    };
    a = {};
    var g = {},
        e = b.getAudioRecorder();
    try {
        a = e.stopRecord(g)
    } catch(d) {}
    b.aiDebug.debug("stop", c, a);
    return a
};
chivox.AiRecorder.prototype.startReplay = function(a) {
    var b = this;
    b.__replayOrderState = "REPLAY_CMD_START";
    var c = {
        recordId: b.getLastRecordId(),
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AiRecorder.cache[b.params.id + "ReplayOnStart"] = function(j, p) {
        delete this[b.params.id + "ReplayOnStart"];
        if (typeof c.onStart == "function") c.onStart(j, p)
    };
    chivox.AiRecorder.cache[b.params.id + "ReplayOnStop"] = function(j, p) {
        delete this[b.params.id + "ReplayOnStop"];
        if (typeof c.onStop == "function") c.onStop(j, p)
    };
    var g = {
        tokenId: c.recordId
    };
    if (typeof a.startPos != "undefined" && typeof a.stopPos != "undefined") {
        var e = parseInt(a.expand > 0 ? a.expand: 0),
            d = parseInt(a.startPos > 0 ? a.startPos: 0);
        a = parseInt(a.stopPos > 0 ? a.stopPos: 0);
        g.startPos = d - e > 0 ? d - e: 0;
        g.stopPos = a + e > 0 ? a + e: 100
    }
    e = {};
    d = b.getAudioRecorder();
    try {
        e = d.startReplay(g)
    } catch(f) {}
    b.aiDebug.debug("startReplay", c, e);
    return e
};
chivox.AiRecorder.prototype.stopReplay = function(a) {
    var b = this;
    b.__replayOrderState = "REPLAY_CMD_STOP";
    var c = {
        onStop: ""
    };
    b.__extend(c, a);
    chivox.AiRecorder.cache[b.params.id + "ForceReplayOnStop"] = function(f, j) {
        if (typeof c.onStop == "function") c.onStop(f, j);
        delete this[b.params.id + "ForceReplayOnStop"]
    };
    a = {};
    var g = {},
        e = b.getAudioRecorder();
    try {
        a = e.stopReplay(g)
    } catch(d) {}
    b.aiDebug.debug("stopReplay", a);
    return a
};
chivox.AiRecorder.prototype.getScores = function(a) {
    this.__getScoreTimeoutStartTime = (new Date).getTime();
    this.__getScores(a)
};
chivox.AiRecorder.prototype.__getScores = function(a) {
    var b = a.recordId;
    if (typeof b === "undefined" || b === null || b === "") {
        if (typeof a.success == "function") {
            a.success(this.result);
            this.aiDebug.debug("==== getScores end ====")
        }
    } else if (typeof b == "string") if (typeof this.result[b] != "undefined") {
        var c = {};
        c[b] = this.result[b];
        if (typeof a.success == "function") {
            a.success(c);
            this.aiDebug.debug("==== getScores end ====")
        }
    } else {
        if ((new Date).getTime() - this.__getScoreTimeoutStartTime >= this.params.coreTimeout) this.result[b] = {
            recordId: b,
            result: {
                errID: "50201",
                error: {
                    tip: "JSSDK getScore timeout"
                }
            }
        }; (function(j, p) {
            j.__getScoreTimeoutId.push(window.setTimeout(function() {
                    j.__getScores(p)
                },
                200))
        })(this, a)
    } else if (Object.prototype.toString.call(b) === "[object Array]") {
        c = {};
        var g = true,
            e;
        for (e in b) if (b.hasOwnProperty(e) != false) {
            var d = b[e];
            if (typeof this.result[d] != "undefined") c[d] = this.result[d];
            else {
                if ((new Date).getTime() - this.__getScoreTimeoutStartTime < this.params.coreTimeout) {
                    g = false; (function(j, p) {
                        j.__getScoreTimeoutId.push(window.setTimeout(function() {
                                j.__getScores(p)
                            },
                            200))
                    })(this, a)
                } else {
                    g = true;
                    for (var f in b) if (b.hasOwnProperty(f) != false) {
                        d = b[f];
                        if (typeof this.result[d] == "undefined") {
                            this.result[d] = {
                                recordId: d,
                                result: {
                                    errID: "50201",
                                    error: {
                                        tip: "JSSDK getScore timeout"
                                    }
                                }
                            };
                            c[d] = this.result[d]
                        }
                    }
                }
                break
            }
        }
        if (g) if (typeof a.success == "function") {
            a.success(c);
            this.aiDebug.debug("==== getScores end ====")
        }
    }
};
chivox.AiRecorder.prototype.getMicStatus = function() {
    var a = "microphone.not.ready",
        b = this.getAudioRecorder();
    try {
        a = b.getMicStatus()
    } catch(c) {}
    this.aiDebug.debug("getMicStatus", a);
    return a
};
chivox.AiRecorder.prototype.getRecorderStatus = function() {
    var a = "recorder.not.ready",
        b = this.getAudioRecorder();
    try {
        a = b.getRecorderStatus()
    } catch(c) {}
    this.aiDebug.debug("getRecorderStatus", a);
    return a
};
chivox.AiRecorder.prototype.getConnectorStatus = function() {
    var a = "connection.not.ready",
        b = this.getAudioRecorder();
    try {
        a = b.getConnectorStatus()
    } catch(c) {}
    this.aiDebug.debug("getConnectorStatus", a);
    return a
};
chivox.AiRecorder.prototype.getCoreRequesterStatus = function() {
    var a = "corerequester.not.ready",
        b = this.getAudioRecorder();
    try {
        a = b.getCoreRequesterStatus()
    } catch(c) {}
    this.aiDebug.debug("getCoreRequesterStatus", a);
    return a
};
chivox.AiRecorder.prototype.setNotifyAudioVolume = function(a) {
    if (typeof a == "number" && isNaN(a) === false) {
        var b = this.getAudioRecorder();
        try {
            b.adjustNotifyAudioVolume(a * 100)
        } catch(c) {}
    }
    this.aiDebug.debug("setNotifyAudioVolume", a);
    return a
};
chivox.AiRecorder.prototype.getNotifyAudioVolume = function() {
    var a = null,
        b = this.getAudioRecorder();
    try {
        a = b.getNotifyAudioVolume() / 100
    } catch(c) {}
    this.aiDebug.debug("getNotifyAudioVolume", a);
    return a
};
chivox.AiRecorder.prototype.showFlash = function() {
    var a = this.getAudioRecorder();
    try {
        a.showFlash()
    } catch(b) {}
    this.aiDebug.debug("showFlash")
};
chivox.AiRecorder.prototype.transparentFlash = function() {
    var a = this.getAudioRecorder();
    try {
        a.transparentFlash()
    } catch(b) {}
    this.aiDebug.debug("transparentFlash")
};
chivox.AiRecorder.prototype.showVolumeBar = function(a, b) {
    var c = this.getAudioRecorder(),
        g = {
            meter: {
                x: 0,
                y: -25,
                visible: false
            },
            slider: {
                x: 0,
                y: 20,
                visible: false
            },
            viewer: {
                x: 0,
                y: 0,
                visible: true
            }
        };
    typeof a != "undefined" && this.__extend(g, a);
    if (typeof b == "undefined" || b == true) this.currentView = g;
    if (this.canRecordCheck.micAllowed || b == false) {
        try {
            c.showVolumeBar(g)
        } catch(e) {}
        this.aiDebug.debug("showVolumeBar")
    }
};
chivox.AiRecorder.prototype.hideVolumeBar = function() {
    var a = this.getAudioRecorder(),
        b = {
            meter: {
                x: 0,
                y: -20,
                visible: true
            },
            slider: {
                x: 0,
                y: 20,
                visible: true
            },
            viewer: {
                x: 0,
                y: 0,
                visible: false
            }
        };
    this.currentView = b;
    if (this.canRecordCheck.micAllowed) {
        try {
            a.showVolumeBar(b)
        } catch(c) {}
        this.aiDebug.debug("hideVolumeBar")
    }
};
chivox.AiRecorder.prototype.setMicVolume = function(a) {
    if (typeof a == "number" && isNaN(a) === false) {
        if (a < 0) a = 0;
        else if (a > 1) a = 1;
        var b = this.getAudioRecorder();
        try {
            b.adjustMicVolume(a * 100)
        } catch(c) {}
    }
    this.aiDebug.debug("recorder adjustMicVolume", a);
    return a
};
chivox.AiRecorder.prototype.getMicVolume = function() {
    var a = null,
        b = this.getAudioRecorder();
    try {
        a = b.getMicVolume() / 100
    } catch(c) {}
    this.aiDebug.debug("recorder getMicVolume", a);
    return a
};
chivox.AiRecorder.prototype.setVolume = function(a) {
    if (typeof a == "number" && isNaN(a) === false) {
        if (a < 0) a = 0;
        else if (a > 1) a = 1;
        var b = this.getAudioRecorder();
        try {
            b.adjustReplayAudioVolume(a * 100)
        } catch(c) {}
    }
    this.aiDebug.debug("recorder adjustReplayAudioVolume", a);
    return a
};
chivox.AiRecorder.prototype.getVolume = function() {
    var a = null,
        b = this.getAudioRecorder();
    try {
        a = b.getReplayAudioVolume() / 100
    } catch(c) {}
    this.aiDebug.debug("recorder getVolume", a);
    return a
};
chivox.AiRecorder.prototype.getMicActivityLevel = function() {
    var a = null,
        b = this.getAudioRecorder();
    try {
        a = b.getMicActivityLevel()
    } catch(c) {}
    this.aiDebug.debug("recorder getMicActivityLevel", a);
    return a
};
chivox.AiRecorder.prototype.reconnect = function() {
    var a = this.getAudioRecorder();
    try {
        a.reconnect()
    } catch(b) {}
};
chivox.AiRecorder.prototype.disconnect = function() {
    var a = this.getAudioRecorder();
    try {
        a.disconnect();
        chivox.AiRecorder.cache[this.params.id + "OnConnectorStatusChange"]("connection.disconnected", {
            error: "no message"
        })
    } catch(b) {}
};
chivox.AiRecorder.prototype.getState = function() {
    var a = {},
        b = this.getAudioRecorder();
    try {
        a = b.getState()
    } catch(c) {}
    if (a.connection.uri == "http://127.0.0.1:5768") {
        a.connection.latency = 100;
        a.connection.throughput = 1E7
    }
    return a
};
chivox.AiRecorder.prototype.rpc = function(a, b, c) {
    var g = "";
    chivox.AiRecorder.cache[this.params.id + "PRCRequestIdGenerated"] = function(f, j, p) {
        if (typeof c != "undefined" && typeof c.onRequestIdGenerated == "function") c.onRequestIdGenerated(f, j, p)
    };
    chivox.AiRecorder.cache[this.params.id + "PRCSuccess"] = function(f, j, p) {
        typeof c != "undefined" && typeof c.success == "function" && c.success(f, j, p)
    };
    chivox.AiRecorder.cache[this.params.id + "PRCError"] = function(f, j) {
        typeof c != "undefined" && typeof c.error == "function" && c.error(f, j)
    };
    var e = this.getAudioRecorder();
    try {
        g = e.rpc(a, b)
    } catch(d) {}
    this.aiDebug.debug("rpc", a, b);
    return g
};
chivox.AiStatusCode = {
    "default": {
        id: "",
        description: "\u672a\u77e5\u9519\u8bef\u3002",
        feedback: {
            en: "Please try again.",
            cn: "\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    default2: {
        id: "default",
        description: "",
        feedback: {
            en: "Speech server error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    default4: {
        id: "default",
        description: "",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    default5: {
        id: "default",
        state: "",
        description: "",
        feedback: {
            en: "Unknown flash error.",
            cn: "\u672a\u77e5\u7684Flash\u9519\u8bef\u3002"
        }
    },
    default6: {
        id: "default",
        description: "",
        feedback: {
            en: "Fatal speech kernal error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u5185\u6838\u51fa\u73b0\u5185\u90e8\u9519\u8bef\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    2 : {
        id: "2",
        description: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3",
        feedback: {
            en: "Speech server detected no start of the speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    5 : {
        id: "5",
        description: "\u8bc4\u5206\u6587\u672c\u4e0d\u6b63\u786e",
        feedback: {
            en: "Incorrect refText.",
            cn: "\u8bc4\u5206\u6587\u672c\u4e0d\u6b63\u786e\u3002"
        }
    },
    6 : {
        id: "6",
        description: "refText\u6587\u672c\u4e0d\u6ee1\u8db3ebnf\u6587\u6cd5",
        feedback: {
            en: "The refText text does not meet the ebnf grammar.",
            cn: "refText\u6587\u672c\u4e0d\u6ee1\u8db3ebnf\u6587\u6cd5\u3002"
        }
    },
    400 : {
        id: "400",
        description: "Audio Decode Error, \u97f3\u9891\u89e3\u7801\u9519\u8bef",
        feedback: {
            en: "Audio decode error, please try again.",
            cn: "\u97f3\u9891\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    407 : {
        id: "407",
        description: "RPC_param error",
        feedback: {
            en: "RPC parameter error.",
            cn: "RPC\u53c2\u6570\u4e0d\u6b63\u786e"
        }
    },
    503 : {
        id: "503",
        description: "RPC timeout",
        feedback: {
            en: "RPC request timeout.",
            cn: "RPC\u8bf7\u6c42\u8d85\u65f6"
        }
    },
    6001 : {
        id: "6001",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    6002 : {
        id: "6002",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    6003 : {
        id: "6002",
        description: "",
        feedback: {
            en: "",
            cn: ""
        }
    },
    20001 : {
        id: "20001",
        description: "VAD\u6a21\u5757\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\u7aef\u70b9",
        feedback: {
            en: "Speech server detected no start of the speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20002 : {
        id: "20002",
        description: "\u8f93\u5165VAD\u6a21\u5757\u7684Package\u6570\u636e\u4e3a\u7a7a",
        feedback: {
            en: "Speech server detected no start of the speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20101 : {
        id: "20101",
        description: "\u63d0\u53d6\u7684\u6240\u6709F0\u7279\u5f81\u5747\u4e3a0",
        feedback: {
            en: "Speech server detected no speech, please try again.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u8bed\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20102 : {
        id: "20102",
        description: "\u7ecf\u8fc7\u7279\u5f81\u540e\u5904\u7406\uff0c\u6ca1\u6709\u5f97\u5230voiced\u6bb5",
        feedback: {
            en: "Speech server detected no speech, please try again.",
            cn: "\u4e0d\u80fd\u8bc6\u522b\u8be5\u53d1\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20300 : {
        id: "20300",
        description: "\u8bc6\u522b\u6a21\u5757\u4e00\u822c\u6027\u9519\u8bef",
        feedback: {
            en: "Speech server detected incompleted speech, please try again.",
            cn: "\u53d1\u97f3\u4e0d\u5b8c\u6574\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20301 : {
        id: "20301",
        description: "\u5355\u8bcd\u6ca1\u6709\u5305\u542b\u5728\u5b57\u5178\u4e2d\u3002\u9700\u8981\u5e94\u7528\u5f00\u53d1\u8005\u5904\u7406\uff0c\u5c06\u6b64\u7c7b\u5355\u8bcd\u53cd\u9988\u7ed9chivox\uff0c\u505a\u6dfb\u52a0\u5b57\u5178\u5904\u7406\u3002",
        feedback: {
            en: "Speech server cannot recognise the speech. Please contact us to report this.",
            cn: "\u5355\u8bcd\u6ca1\u6709\u5305\u542b\u5728\u5b57\u5178\u4e2d\uff0c\u8bf7\u68c0\u67e5\u53c2\u8003\u6587\u672c\u662f\u5426\u6b63\u786e\u3002\u5982\u679c\u4ecd\u6709\u95ee\u9898\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    20302 : {
        id: "20302",
        description: "\u6ca1\u6709\u8bc6\u522b\u7ed3\u679c, no token suvived",
        feedback: {
            en: "Speech server cannot recognise the speech. Please try again.",
            cn: "\u4e0d\u80fd\u8bc6\u522b\u8be5\u53d1\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20303 : {
        id: "20303",
        description: "\u5207\u5206\u6ca1\u6709\u7ed3\u679c, no token suvived",
        feedback: {
            en: "Speech server cannot recognise the speech. Please try again.",
            cn: "\u4e0d\u80fd\u8bc6\u522b\u8be5\u53d1\u97f3\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20401 : {
        id: "20401",
        description: "\u4fe1\u566a\u6bd4\u8fc7\u4f4e",
        feedback: {
            en: "Speech is too weak to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u4f4e\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20402 : {
        id: "20402",
        description: "\u8bed\u97f3\u80fd\u91cf\u8fc7\u4f4e",
        feedback: {
            en: "Speech is too weak to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u4f4e\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20403 : {
        id: "20403",
        description: "\u8bed\u97f3\u80fd\u91cf\u8fc7\u9ad8",
        feedback: {
            en: "Speech is too laud to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u9ad8\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    20404 : {
        id: "20404",
        description: "\u51fa\u73b0\u622a\u5e45\u73b0\u8c61",
        feedback: {
            en: "Speech is too laud to process, please try again.",
            cn: "\u60a8\u8bf4\u8bdd\u7684\u97f3\u91cf\u592a\u9ad8\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40001 : {
        id: "40001",
        description: "AUDIO_FILE_NOTEXSIT",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40002 : {
        id: "40002",
        description: "AUDIO_FILE_OPEN_FAIL",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40003 : {
        id: "40003",
        description: "AUDIO_CONVERT_ERROR, convert flv to wav error",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40004 : {
        id: "40004",
        description: "AUDIO_FILE_EMPTY, file size <= 13 bytes",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40011 : {
        id: "40011",
        description: "AMQ_CONNECTION_CLOSE",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40012 : {
        id: "40012",
        description: "AMQ_MESSAGE_BROKEN",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40013 : {
        id: "40013",
        description: "AMQ_SEND_MESSAGE_ERROR",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40030 : {
        id: "40030",
        description: "PARAM_MISMATCH_CORETYPE, coreType\u4e0d\u5b58\u5728",
        feedback: {
            en: "Invalid coreType",
            cn: "coreType\u4e0d\u5b58\u5728\u3002"
        }
    },
    40031 : {
        id: "40031",
        description: "NO_AUDIO_DATA, \u6ca1\u6709\u68c0\u6d4b\u5230\u97f3\u9891\u6570\u636e\uff0c\u9ea6\u514b\u98ce\u88ab\u7981\u6b62",
        feedback: {
            en: "No audio data, please check your microphone settings.",
            cn: "\u6ca1\u6709\u68c0\u6d4b\u5230\u97f3\u9891\u6570\u636e\uff0c\u8bf7\u68c0\u67e5\u9ea6\u514b\u98ce\u8bbe\u7f6e\u3002"
        }
    },
    40032 : {
        id: "40032",
        description: "USERID_ERROR\uff0cuserId\u4e3a\u7a7a",
        feedback: {
            en: "Error: userId cannot empty.",
            cn: "userId\u4e3a\u7a7a\uff0c\u8bf7\u68c0\u67e5"
        }
    },
    40050 : {
        id: "40050",
        description: "RPC_REQUESTID_ERROR, RPC\u8c03\u7528\u65f6requestId\u957f\u5ea6\u4e0d\u662f32\u4e2a\u5b57\u7b26",
        feedback: {
            en: "Invalid requestId",
            cn: "RPC\u8c03\u7528\u65f6requestId\u957f\u5ea6\u4e0d\u662f32\u4e2a\u5b57\u7b26"
        }
    },
    40051 : {
        id: "40051",
        description: "RPC_METHOD_ERROR, \u5ba2\u6237\u7aef\u8c03\u7528RPC\u65b9\u6cd5\u540d\u79f0\u4e0d\u5b58\u5728\uff0c\u65b9\u6cd5\u540d\u79f0\u4e3a\u7a7a\uff0c\u6216\u8005\u4e0d\u662fSPEECH_CALC,SPEECH_SYN",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    40052 : {
        id: "40052",
        description: "RPC_CLIENT_PARAM_ERROR, RPC\u8c03\u7528\u4f20\u9012\u7684\u8fdb\u884c\u8bc4\u5206\u7684\u53c2\u6570\u4e3a\u7a7a\uff0c\u6216\u8005\u53c2\u6570\u957f\u5ea6\u5927\u4e8e100KB\uff0c\u6216\u8005\u683c\u5f0f\u975e\u6cd5\u3002\u8bf7\u68c0\u67e5serverParams\u53c2\u6570\u3002",
        feedback: {
            en: "Please check your serverParams.",
            cn: "RPC_CLIENT_PARAM_ERROR, RPC\u8c03\u7528\u4f20\u9012\u7684\u8fdb\u884c\u8bc4\u5206\u7684\u53c2\u6570\u4e3a\u7a7a\uff0c\u6216\u8005\u53c2\u6570\u957f\u5ea6\u5927\u4e8e100KB\uff0c\u6216\u8005\u683c\u5f0f\u975e\u6cd5\u3002\u8bf7\u68c0\u67e5serverParams\u53c2\u6570\u3002"
        }
    },
    40053 : {
        id: "40053",
        description: "RPC_INVOKE_PARAM_ERROR, RPC\u8c03\u7528\u65b9\u6cd5\u7684\u53c2\u6570\u9519\u8bef\uff0c\u53c2\u6570\u4e3a\u7a7a\uff0c\u6216\u8005\u53c2\u6570\u957f\u5ea6\u5c0f\u4e8e3",
        feedback: {
            en: "Media server error, please try again.",
            cn: "RPC_INVOKE_PARAM_ERROR, RPC\u8c03\u7528\u65b9\u6cd5\u7684\u53c2\u6570\u9519\u8bef\uff0c\u53c2\u6570\u4e3a\u7a7a\uff0c\u6216\u8005\u53c2\u6570\u957f\u5ea6\u5c0f\u4e8e3"
        }
    },
    40080 : {
        id: "40080",
        description: "\u8eab\u4efd\u9a8c\u8bc1\u5931\u8d25 ",
        feedback: {
            en: "Authentication failed.",
            cn: "\u8eab\u4efd\u9a8c\u8bc1\u5931\u8d25\u3002"
        }
    },
    40081 : {
        id: "40081",
        description: "\u672a\u901a\u8fc7\u8eab\u4efd\u9a8c\u8bc1\u6216\u8005session\u8d85\u65f6(Session not exists)",
        feedback: {
            en: "Session not exists.",
            cn: "\u672a\u901a\u8fc7\u8eab\u4efd\u9a8c\u8bc1\u6216\u8005\u4f1a\u8bdd\u8d85\u65f6\u3002"
        }
    },
    40082 : {
        id: "40082",
        description: "\u6ca1\u6709\u6743\u9650\u8bbf\u95ee\u76f8\u5e94\u7684API",
        feedback: {
            en: "Authenticated failed to access the API.",
            cn: "\u6ca1\u6709\u6743\u9650\u8bbf\u95ee\u76f8\u5e94\u7684API\u3002"
        }
    },
    40086 : {
        id: "40086",
        description: "\u5fc5\u9700\u7684\u5185\u6838\u53c2\u6570\u9519\u8bef ",
        feedback: {
            en: "Necessary core parameters error.",
            cn: "\u5fc5\u9700\u7684\u5185\u6838\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    40091 : {
        id: "40091",
        description: "\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef\uff0c\u5185\u6838\u8fd4\u56de\u7ed3\u679c\u4e3a\u7a7a",
        feedback: {
            en: "Internal server error.",
            cn: "\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef\u3002"
        }
    },
    40092 : {
        id: "40092",
        description: "\u97f3\u9891\u6570\u636e\u8d85\u8fc75MB",
        feedback: {
            en: "Audio data should not exceed 5M.",
            cn: "\u97f3\u9891\u6570\u636e\u8d85\u8fc75M"
        }
    },
    40093 : {
        id: "40093",
        description: "\u8bf7\u6c42\u8bc4\u5206\u8ba1\u7b97\u8d85\u65f6",
        feedback: {
            en: "Request score timeout.",
            cn: "\u8bf7\u6c42\u8bc4\u5206\u8ba1\u7b97\u8d85\u65f6"
        }
    },
    40094 : {
        id: "40094",
        description: "\u4e0e\u8ba1\u7b97\u8282\u70b9\u65ad\u5f00\u8fde\u63a5",
        feedback: {
            en: "Disconnected to the Compute nodes.",
            cn: "\u4e0e\u8ba1\u7b97\u8282\u70b9\u65ad\u5f00\u8fde\u63a5"
        }
    },
    40095 : {
        id: "40095",
        description: "\u97f3\u9891\u6d41\u9519\u8bef\u6216\u8005lua\u811a\u672c\u9519\u8bef",
        feedback: {
            en: "Audio stream error or Lua script error.",
            cn: "\u97f3\u9891\u6d41\u9519\u8bef\u6216\u8005lua\u811a\u672c\u9519\u8bef\u3002"
        }
    },
    40096 : {
        id: "40096",
        description: "\u6ca1\u6709\u53ef\u7528\u7684\u8ba1\u7b97\u8282\u70b9",
        feedback: {
            en: "There is no available compute nodes.",
            cn: "\u6ca1\u6709\u53ef\u7528\u7684\u8ba1\u7b97\u8282\u70b9\u3002"
        }
    },
    40097 : {
        id: "40097",
        description: "\u8bf7\u6c42\u8ba1\u7b97\u7684\u6570\u636e\u5305\u9519\u8bef\uff0c\u6570\u636e\u5305\u7ed3\u6784\u4e0d\u5b8c\u6574",
        feedback: {
            en: "Request the calculation of packet error, the packet structure is incomplete.",
            cn: "\u8bf7\u6c42\u8ba1\u7b97\u7684\u6570\u636e\u5305\u9519\u8bef\uff0c\u6570\u636e\u5305\u7ed3\u6784\u4e0d\u5b8c\u6574\u3002"
        }
    },
    5E4: {
        id: "50000",
        state: "FLASH_LOAD_COMPLETE",
        description: "\u5f53\u52a0\u8f7dflash \u5b8c\u6210\u65f6\uff08\u8fd9\u91cc\u8bf4\u7684\u5b8c\u6210\uff0c\u6307\u7684\u662f\u81ea\u5df1\u5df2\u7ecf\u5b8c\u6210\u4e86\u521d\u59cb\u5316\uff0c\u5e76\u4e14\u548cJS \u63e1\u624b\u6210\u529f\u540e\uff09\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Flash load success.",
            cn: "Flash\u52a0\u8f7d\u6210\u529f\u3002"
        }
    },
    50001 : {
        id: "50001",
        state: "MIC_UNMUTED",
        description: "\u5f53mic \u521d\u59cb\u5316\u65f6\u4f1a\u8c03\u7528\u68c0\u6d4bmic \u662f\u5426\u5141\u8bb8\u7684\u51fd\u6570 \uff0c \u5982\u679c\u68c0\u6d4b\u7ed3\u679c\u662f\u5141\u8bb8\uff0c\u90a3\u4e48\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff1b \u5982\u679c\u4ece\u7981\u7528\u72b6\u6001\u4e0b\uff0c \u7528\u6237\u901a\u8fc7\u8bbe\u7f6e\uff0c\u624b\u52a8\u5141\u8bb8\u4e86mic\uff0c\u4e5f\u4f1a\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Microphone is allowed.",
            cn: "Flash\u53ef\u4ee5\u8bbf\u95ee\u9ea6\u514b\u98ce\u3002"
        }
    },
    50002 : {
        id: "50002",
        state: "MIC_MUTED",
        description: "\u5f53mic \u521d\u59cb\u5316\u65f6\u4f1a\u8c03\u7528\u68c0\u6d4bmic \u662f\u5426\u5141\u8bb8\u7684\u51fd\u6570\uff0c\u5982\u679c\u68c0\u6d4b\u7ed3\u679c\u662f \u4e0d\u5141\u8bb8\uff0c\u90a3\u4e48\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff1b\u5982\u679c\u4ece\u5141\u8bb8\u72b6\u6001\u4e0b\uff0c \u7528\u6237\u901a\u8fc7\u8bbe\u7f6e\uff0c\u624b\u52a8\u7981\u7528\u4e86mic\uff0c\u4e5f\u4f1a\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Microphone is not allowed, please check for Flash Player's Setting panel.",
            cn: "Flash\u4e0d\u80fd\u8bbf\u95ee\u9ea6\u514b\u98ce\uff0c\u8bf7\u68c0\u67e5\u8bbe\u7f6e\u3002"
        }
    },
    50003 : {
        id: "50003",
        state: "MIC_NOT_FOUND",
        description: "\u5f53mic \u521d\u59cb\u5316\u65f6\u4f1a\u8c03\u7528\u68c0\u6d4bmic \u662f\u5426\u5141\u8bb8\u7684\u51fd\u6570\uff0c \u5982\u679c\u68c0\u6d4b\u4e0d\u5230mic\uff0c\u90a3\u4e48\u56de\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Found no Microphone device, please check for it.",
            cn: "\u6ca1\u6709\u627e\u5230\u9ea6\u514b\u98ce\u8bbe\u5907\uff0c\u8bf7\u68c0\u67e5\u3002"
        }
    },
    50004 : {
        id: "50004",
        state: "FUNCTION_EXECUTE_SUCCESSFUL",
        description: "\u5f53\u8c03\u7528\u51fd\u6570\u65f6\uff0c\u4f20\u53c2\u6b63\u786e\u65f6\uff0c\u76f4\u63a5\u51fd\u6570\u8fd4\u56de\u503c\u8fd4\u56de\u6b64\u6d88\u606f",
        feedback: {
            en: "Function is executed",
            cn: "\u51fd\u6570\u6267\u884c\u6210\u529f\u3002"
        }
    },
    50007 : {
        id: "50007",
        state: "MMSCFG_INVALID",
        description: "\u68c0\u6d4b\u5230mms.cfg\u6587\u4ef6\u4e2d\u7684avHardwareDisable\u914d\u7f6e\u6709\u8bef\uff0c\u8bf7\u624b\u52a8\u4fee\u6539\u6216\u5220\u9664 mms.cfg\u6587\u4ef6",
        feedback: {
            en: "The mms.cfg file is not configured correctly, please delete it manually.",
            cn: "mms.cfg\u6587\u4ef6\u914d\u7f6e\u4e0d\u6b63\u786e\uff0c\u8bf7\u624b\u52a8\u5220\u9664\u3002"
        }
    },
    50008 : {
        id: "50008",
        state: "MIC_PANEL_CLOSED",
        description: "\u5728flash\u5141\u8bb8\u72b6\u6001\u4e0b\uff0c\u7b2c\u4e00\u6b21\u70b9\u51fbflash\u9762\u677f\u4e0a\u7684\u5173\u95ed\u6309\u94ae\uff0c\u89e6\u53d1\u7684\u6b64\u4e8b\u4ef6",
        feedback: {
            en: "Click the close button on flash panel",
            cn: "\u70b9\u51fb\u4e86flash\u4e0a\u7684\u5173\u95ed\u6309\u94ae"
        }
    },
    50100 : {
        id: "50100",
        state: "FMS_CONNECT_SUCCESSFUL",
        description: "\u5f53\u8fde\u63a5\u4e0a\u6d41\u5a92\u4f53\u670d\u52a1\u5668\u65f6\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Successful to connect media server.",
            cn: "\u5f55\u97f3\u670d\u52a1\u5668\u8fde\u63a5\u6210\u529f\u3002"
        }
    },
    50101 : {
        id: "50101",
        state: "FMS_CONNECT_FAILED",
        description: "\u5f53\u8fde\u63a5\u6d41\u5a92\u4f53\u670d\u52a1\u65f6\uff0c\u7531\u4e8e\u65e0\u6cd5\u8bbf\u95ee\u5230 server \u5730\u5740\u800c\u8fde\u63a5\u4e0d\u4e0a server\uff0c \u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03sub code: Auth.Failed",
        feedback: {
            en: "Failed to connect to the media server.",
            cn: "\u8fde\u63a5\u5f55\u97f3\u670d\u52a1\u5668\u5931\u8d25\u3002"
        }
    },
    50102 : {
        id: "50102",
        state: "FMS_CONNECT_REJECTED",
        description: "\u8fde\u63a5\u6d41\u5a92\u4f53\u670d\u52a1\u65f6\uff0c\u5df2\u7ecf\u627e\u5230\u670d\u52a1\u5668\uff0c\u4f46\u662f\u670d\u52a1\u5668\u62d2\u7edd\u4e86\u8fde\u63a5\u8bf7\u6c42\uff0c\u5219\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Failed to connect to the media server.",
            cn: "\u8fde\u63a5\u5f55\u97f3\u670d\u52a1\u5668\u5931\u8d25\u3002"
        }
    },
    50103 : {
        id: "50103",
        state: "FMS_CONNECT_CLOSED",
        description: "\u5df2\u7ecf\u8fde\u4e0a\u670d\u52a1\u5668\uff0c\u4f46\u662f\u670d\u52a1\u5668\u7aef\u4e3b\u52a8\u65ad\u5f00\u4e86\u8fde\u63a5\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Connection to the media server is closed.",
            cn: "\u5f55\u97f3\u670d\u52a1\u5668\u65ad\u5f00\u4e86\u8fde\u63a5\u3002"
        }
    },
    50104 : {
        id: "50104",
        state: "FMS_CONNECT_TIMEOUT",
        description: "\u8fde\u63a5\u6d41\u5a92\u4f53\u670d\u52a1\u5668\u65f6\uff0c\u5982\u679c\u5728\u8bbe\u5b9a\u7684\u65f6\u95f4\u5185\u672a\u8fde\u4e0a\uff0c\u5219\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff0c\u5e76\u4e14\u5f55\u97f3\u673a\u4e0d\u518d\u8fdb\u884c\u8fde\u63a5\u8bf7\u6c42",
        feedback: {
            en: "Request to connect to the media server is time out.",
            cn: "\u8fde\u63a5\u5f55\u97f3\u670d\u52a1\u5668\u8d85\u65f6\u3002"
        }
    },
    50105 : {
        id: "50105",
        state: "FMS_CONNECT_NET_CHANGE",
        description: "\u5f53\u5ba2\u6237\u7aef\u7684\u7269\u7406\u7f51\u7edc\u7aef\u53e3\u53d1\u751f\u53d8\u5316\u65f6\uff08\u6bd4\u5982\uff0c \u7269\u7406\u8fde\u63a5\u65ad\u5f00\uff0c\u6216\u7269\u7406\u8fde\u63a5\u8fde\u4e0a\u4e86\uff09\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: null
    },
    50106 : {
        id: "50106",
        state: "EXCEPTION_FMS_DISCONNECTED",
        description: "\u5f53\u524d\u53f0\u8c03\u7528\u51fd\u6570startRecord \u6216startReplay \u65f6\uff0c\u5982\u679c\u6b64\u65f6\u672a\u8fde\u63a5\u4e0a\u6d41\u5a92\u4f53\u670d\u52a1\u5668\uff0c \u90a3\u4e48\u5c06\u4f1a\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Function execute failed.",
            cn: "\u51fd\u6570\u6267\u884c\u5931\u8d25\u3002"
        }
    },
    50108 : {
        id: "50108",
        state: "ASPING_DETECT_STATUS",
        description: "\u5e26\u5bbd\u68c0\u6d4b\u7684\u5f53\u524d\u72b6\u6001\u53cd\u9988\uff0c\u4e3b\u8981\u7528\u6765\u4f5c\u4e3aDebug \u65f6\u7684info\u53c2\u8003\u4fe1\u606f",
        feedback: null
    },
    50109 : {
        id: "50109",
        state: "FMS_CONNECT_START",
        description: "\u5f55\u97f3\u673a\u5728\u5f00\u59cb\u8fde\u63a5\u670d\u52a1\u5668\u65f6\u56de\u8c03js\uff0c\u56de\u8c03\u7684\u63a5\u53e3\u662fonConnectorStatusChange",
        feedback: {
            en: "Start to connect recorder server.",
            cn: "\u5f00\u59cb\u8fde\u63a5\u5f55\u97f3\u670d\u52a1\u5668\u3002"
        }
    },
    50200 : {
        id: "50200",
        state: "CORE_REQUEST_SUCCESS",
        description: "\u5f53\u5f55\u97f3\u7ed3\u675f\uff0c\u5f55\u97f3\u673a\u4ece\u670d\u52a1\u5668\u7aef\u53d6\u5f97\u5185\u6838\u53cd\u9988\u7ed3\u679c\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff0c\u5f55\u97f3\u7ed3\u679c\u5c06\u76f4\u63a5\u5b58\u653e\u5728\u56de\u8c03\u7684msg \u53c2\u6570\u4e2d\uff0c\u4e3ajson\u5bf9\u8c61\u683c\u5f0f",
        feedback: {
            en: "Core request success.",
            cn: "\u8bc4\u5206\u6210\u529f\u3002"
        }
    },
    50201 : {
        id: "50201",
        state: "CORE_REQUEST_TIMEOUT",
        description: "\u5f53\u5f55\u97f3\u7ed3\u675f\u540e\uff0c\u5728\u8bbe\u5b9a\u7684\u65f6\u95f4\u5185\uff0c\u670d\u52a1\u5668\u6ca1\u6709\u7ed9\u53cd\u9988\uff0c\u5219\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\uff0cflash \u5f55\u97f3\u673a\u5c06\u4e0d\u4f1a\u518d\u5bf9\u8fd9\u6b21\u5f55\u97f3\u6709\u4efb\u4f55\u53cd\u9988",
        feedback: {
            en: "Request to contact the speech server is time out.",
            cn: "\u8bc4\u5206\u8d85\u65f6\u3002"
        }
    },
    50202 : {
        id: "50202",
        state: "SERVER_PARAMS_ERROR",
        description: "\u5f55\u97f3\u673a\u5411\u670d\u52a1\u5668\u53d1\u9001\u7684\u6570\u636e\u4e0d\u5b8c\u6574",
        feedback: {
            en: "Get score failed, please try again.",
            cn: "\u8bc4\u5206\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    50300 : {
        id: "50300",
        state: "RECORD_STOP",
        description: '\u5f53\u5f55\u97f3\u7ed3\u675f\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03\u5b50\u72b6\u6001 stopType, "0"\u8868\u793a \u81ea\u52a8\u505c\u6b62\u7684 \uff0c "1"\u8868\u793a \u624b\u52a8\u505c\u6b62\u7684',
        feedback: {
            en: "Recording stopped.",
            cn: "\u5f55\u97f3\u505c\u6b62\u3002"
        }
    },
    50301 : {
        id: "50301",
        state: "RECORD_START",
        description: "\u5f53\u5f55\u97f3\u771f\u6b63\u5f00\u59cb\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "Recording started",
            cn: "\u5f55\u97f3\u5f00\u59cb\u3002"
        }
    },
    50302 : {
        id: "50302",
        state: "REPLAY_STOP",
        description: "\u56de\u653e\u7ed3\u675f",
        feedback: {
            en: "Replaying stopped.",
            cn: "\u56de\u653e\u505c\u6b62"
        }
    },
    50303 : {
        id: "50303",
        state: "REPLAY_START",
        description: "\u56de\u653e\u5f00\u59cb",
        feedback: {
            en: "Replaying start.",
            cn: "\u56de\u653e\u5f00\u59cb\u3002"
        }
    },
    50304 : {
        id: "50304",
        state: "RECORDID_GETTED",
        description: "\u5f53\u5728\u5f00\u59cb\u5f55\u97f3\u524d\uff0c\u83b7\u5f97\u5f55\u97f3recordId \u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u56de\u8c03",
        feedback: {
            en: "RecordId generated.",
            cn: "\u83b7\u5f97\u5f55\u97f3ID\u6210\u529f\u3002"
        }
    },
    50350 : {
        id: "50350",
        state: "ERROR_RECORDER_FLASHVARS_PARAMETER_ERROR",
        description: "\u5f55\u97f3\u673a\u521d\u59cb\u5316\u53c2\u6570\u9519\u8bef",
        feedback: {
            en: "Flashvars parameter error.",
            cn: "Flash\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50351 : {
        id: "50351",
        state: "ERROR_STARTRECORD_PARAMETER_ERROR",
        description: "\u5f55\u97f3\u673astartRecord \u51fd\u6570\u53c2\u6570\u9519\u8bef",
        feedback: {
            en: "StartRecord parameter error",
            cn: "\u5f55\u97f3\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50352 : {
        id: "50352",
        state: "ERROR_STARTREPLAY_PARAMETER_ERROR",
        description: "\u5f55\u97f3\u673astartReplay \u51fd\u6570\u53c2\u6570\u9519\u8bef",
        feedback: {
            en: "StartReplay parameter error",
            cn: "\u56de\u653e\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50353 : {
        id: "50353",
        state: "ERROR_RECORDER_STATUS_ERROR",
        description: '\u5f55\u97f3\u673a\u5728\u8c03\u7528\u51fd\u6570\u65f6\u7684\u72b6\u6001\u9519\u8bef\uff0c\u5b50\u72b6\u6001\u6709\uff1a<br>CANNOT_BE_RECORDING = "status.invalid:recording"<br>CANNOT_BE_IDLE = "status.invalid:idle"<br>CANNOT_BE_REPLAYING = "status.invalid:replaying"<br>CANNOT_BE_NOT_READY = "status.invalid:not_ready"<br>CANNOT_BE_INIT = "status.invalid:init"',
        feedback: {
            en: "Recorder status error.",
            cn: "\u8c03\u7528\u51fd\u6570\u524d\uff0c\u5f55\u97f3\u673a\u72b6\u6001\u4e0d\u6b63\u786e\u3002"
        }
    },
    50400 : {
        id: "50400",
        state: "PLAYER_AUDIO_LOAD_COMPLETED",
        description: "\u5728\u64ad\u653e\u524d\uff0c\u97f3\u9891\u52a0\u8f7d\u6210\u529f\u65f6\uff0c\u56de\u8c03\u6d88\u606f\u3002\u5982\u679c\u52a0\u8f7d\u65f6\u7684url\u4f7f\u7528\u7684\u662fhttp\u534f\u8bae\u5219\u8868\u793a\u52a0\u8f7dmp3\u5b8c\u6210\uff0c \u5982\u679c\u662frtmp\u534f\u8bae\u5219\u8868\u793a\u8fde\u63a5\u6d41\u5a92\u4f53\u670d\u52a1\u5668\u6210\u529f",
        feedback: {
            en: "Audio load success.",
            cn: "\u52a0\u8f7d\u97f3\u9891\u6210\u529f\u3002"
        }
    },
    50401 : {
        id: "50401",
        state: "\u8c03\u7528startAudioPlay()\u540e\uff0c\u56de\u8c03\u6d88\u606f",
        description: "PLAY_START",
        feedback: {
            en: "Playing started.",
            cn: "\u64ad\u653e\u5f00\u59cb\u3002"
        }
    },
    50402 : {
        id: "50402",
        state: "PLAY_STOP",
        description: '\u8c03\u7528stopAudioPlay()\u540e\uff0c\u6216\u97f3\u9891\u81ea\u52a8\u64ad\u653e\u505c\u6b62\u540e\uff0c \u56de\u8c03\u6d88\u606f\u3002\u5b50\u72b6\u6001\uff1a<br>stopType: "0"\u4ee3\u8868\u81ea\u52a8\u505c\u6b62\uff0c"1"\u4ee3\u8868\u624b\u52a8\u505c\u6b62',
        feedback: {
            en: "Playing stopped.",
            cn: "\u64ad\u653e\u505c\u6b62\u3002"
        }
    },
    50403 : {
        id: "50403",
        state: "PLAY_BUFFERING",
        description: "\u4f7f\u7528RTMP\uff0c\u5e76\u5728\u64ad\u653e\u4e2d\u7f13\u51b2\u533a\u6570\u636e\u4e0d\u8db3\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Buffering.",
            cn: "\u6b63\u5728\u7f13\u51b2\u3002"
        }
    },
    50404 : {
        id: "50404",
        state: "PLAY_CONTINUE",
        description: "\u4f7f\u7528RTMP\uff0c\u5e76\u5728\u64ad\u653e\u4e2d\u7f13\u51b2\u533a\u6570\u636e\u5145\u8db3\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Playing continue.",
            cn: "\u64ad\u653e\u7ee7\u7eed\u3002"
        }
    },
    50405 : {
        id: "50405",
        state: "\u5728\u64ad\u653e\u4e2d\u8c03\u7528pauseAudioPlay()\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        description: "PLAY_PAUSE",
        feedback: {
            en: "Playing paused.",
            cn: "\u64ad\u653e\u6682\u505c\u3002"
        }
    },
    50406 : {
        id: "50406",
        state: "PLAY_RESUME",
        description: "\u5728\u64ad\u653e\u4e2d\u8c03\u7528resumeAudioPlay()\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Playing resumed.",
            cn: "\u64ad\u653e\u6062\u590d\u3002"
        }
    },
    50407 : {
        id: "50407",
        state: "PLAY_SEEK_SUCCESSFUL",
        description: "\u5728\u64ad\u653e\u5f00\u59cb\u65f6seek \u64cd\u4f5c\u6210\u529f\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Play seek success.",
            cn: "\u64ad\u653e\u5b9a\u4f4d\u6210\u529f\u3002"
        }
    },
    50408 : {
        id: "50408",
        state: "PLAY_SEEK_FAILED",
        description: "\u64ad\u653e\u5f00\u59cb\u65f6\uff0cseek \u64cd\u4f5c\u5931\u8d25\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Failed to locate the position to start playing.",
            cn: "\u64ad\u653e\u5b9a\u4f4d\u5931\u8d25\u3002"
        }
    },
    50409 : {
        id: "50409",
        state: "PLAY_FILE_NOT_FOUND",
        description: "\u64ad\u653e\u65f6\uff0c\u6ca1\u6709\u627e\u5230\u6587\u4ef6\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Targeting audio file does not exist.",
            cn: "\u6ca1\u6709\u627e\u5230\u76ee\u6807\u6587\u4ef6\u3002"
        }
    },
    50410 : {
        id: "50410",
        state: "PLAY_SERVER_ERROR",
        description: "\u64ad\u653e\u97f3\u9891\u65f6\uff0c\u670d\u52a1\u5668\u7aef\u51fa\u73b0\u9519\u8bef\u65f6\uff0c\u56de\u8c03\u6d88\u606f\uff0c\u4f46\u662f\u5e76\u4e0d\u662f\u6307\u64ad\u653e\u97f3\u9891\u5df2\u7ecf\u505c\u6b62\u4e86\uff0c\u800c\u662f\u8fd8\u5728\u7ee7\u7eed\uff0c\u5177\u4f53\u662f\u4ec0\u4e48\u9519\u8bef\uff0c \u9700\u8981\u67e5\u8be2\u670d\u52a1\u5668\u65e5\u5fd7",
        feedback: {
            en: "Play failed, please try again.",
            cn: "\u64ad\u653e\u51fa\u9519\u3002"
        }
    },
    50411 : {
        id: "50411",
        state: "PLAY_NETSTREAM_INSUFFICIENT_BW",
        description: "\u64ad\u653e\u6d41\u5a92\u4f53\u5e26\u5bbd\u8fc7\u5c0f\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Media server error, please try again.",
            cn: "\u5a92\u4f53\u670d\u52a1\u5668\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    },
    50412 : {
        id: "50412",
        state: "PLAYER_AUDIO_LOAD_FAILED",
        description: "\u52a0\u8f7d\u97f3\u9891\u5931\u8d25\u65f6\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Load audio error.",
            cn: "\u52a0\u8f7d\u97f3\u9891\u5931\u8d25\u3002"
        }
    },
    50413 : {
        id: "50413",
        state: "PLAYER_FILE_NOT_LOADED",
        description: "\u8c03\u7528startAudioPlay()\u65f6\uff0c\u53d1\u73b0\u97f3\u9891\u5c1a\u672a\u52a0\u8f7d\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "You should load audio before play.",
            cn: "\u64ad\u653e\u524d\u8bf7\u5148\u52a0\u8f7d\u97f3\u9891\u3002"
        }
    },
    50414 : {
        id: "50414",
        state: "PLAYER_LOAD_START",
        description: "\u64ad\u653e\u5668\u5728\u5f00\u59cb\u8fde\u63a5\u670d\u52a1\u5668\u65f6\u56de\u8c03js\uff0c\u63a5\u53e3\u662fload\u65b9\u6cd5\u7684start\u56de\u8c03",
        feedback: {
            en: "Player load start.",
            cn: "\u64ad\u653e\u5668\u5f00\u59cb\u52a0\u8f7d\u97f3\u9891\u3002"
        }
    },
    50415 : {
        id: "50415",
        state: "PLAYER_IS_IDLE",
        description: "\u8c03\u7528stopAudioPlay()\u65f6\uff0c\u53d1\u73b0\u64ad\u653e\u5668\u5df2\u7ecf\u5904\u5728\u4e86\u5f85\u547d\u72b6\u6001\uff0c\u56de\u8c03\u6d88\u606f",
        feedback: {
            en: "Player is idle.",
            cn: "\u64ad\u653e\u5668\u662fIDLE\u72b6\u6001\u7684\u3002"
        }
    },
    50450 : {
        id: "50450",
        state: "ERROR_STARTPLAY_PARAMETER_ERROR",
        description: "\u8c03\u7528startAudioPlay()\u65f6\uff0c\u53d1\u73b0\u64ad\u653e\u53c2\u6570\u9519\u8bef\uff0c\u65b9\u6cd5\u76f4\u63a5\u8fd4\u56de\u6d88\u606f",
        feedback: {
            en: "StartPlay parameter error.",
            cn: "\u64ad\u653e\u53c2\u6570\u9519\u8bef"
        }
    },
    50451 : {
        id: "50451",
        state: "ERROR_LOADAUDIO_PARAMETER_ERROR",
        description: "\u8c03\u7528loadAudioFromURL()\u65f6\uff0c\u53d1\u73b0load\u53c2\u6570\u9519\u8bef\uff0c\u65b9\u6cd5\u76f4\u63a5\u8fd4\u56de\u6d88\u606f",
        feedback: {
            en: "LoadAudio parameter error.",
            cn: "\u52a0\u8f7d\u97f3\u9891\u53c2\u6570\u9519\u8bef"
        }
    },
    50452 : {
        id: "50452",
        state: "ERROR_ADJUSTVOLUME_PARAMETER_ERROR",
        description: "\u8c03\u7528adjustVolume()\u65f6\uff0c\u53d1\u73b0\u6b64\u65b9\u6cd5\u7684\u53c2\u6570\u6709\u9519\u8bef\uff0c \u65b9\u6cd5\u76f4\u63a5\u8fd4\u56de\u6d88\u606f",
        feedback: {
            en: "AdjustVolume parameter error.",
            cn: "\u8c03\u8282\u97f3\u91cf\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50453 : {
        id: "50453",
        state: "ERROR_PLAYER_FLASHVARS_ERROR",
        description: "\u5f53\u5f00\u59cb\u4f20flashVars \u4e2d\u53c2\u6570\u6709\u9519\u8bef\u65f6\uff0c\u56de\u8c03\u6b64\u6d88\u606f",
        feedback: {
            en: "Flashvars parameter error.",
            cn: "Flash\u53c2\u6570\u9519\u8bef\u3002"
        }
    },
    50454 : {
        id: "50454",
        state: "ERROR_PLAYER_STATUS_ERROR",
        description: '\u5f53\u8c03\u7528\u67d0\u51fd\u6570\u65f6\uff0c\u53d1\u73b0\u72b6\u6001\u9519\u8bef\u65f6\uff0c\u89e6\u53d1\u6b64\u6d88\u606f\u3002\u5b50\u72b6\u6001\uff1a CANNOT_BE_IDLE = "status.invalid:idle"<br>CANNOT_BE_NOT_READY = "status.invalid:not_ready"<br>CANNOT_BE_INIT = "status.invalid:init"<br>CANNOT_BE_PLAYING = "status.invalid:playing"<br>CANNOT_BE_LOADING = "status.invalid:loading"<br>CANNOT_BE_PAUSE = "status.invalid:pause"<br>CANNOT_BE_BUFFERING = "status.invalid:buffering"<br>CANNOT_BE_LOADED = "status.invalid:loaded"s',
        feedback: {
            en: "Player status error.",
            cn: "\u8c03\u7528\u51fd\u6570\u524d\uff0c\u64ad\u653e\u5668\u72b6\u6001\u4e0d\u6b63\u786e\u3002"
        }
    },
    50455 : {
        id: "50455",
        state: "PLAYER_AUDIO_LOAD_STARTED",
        description: "\u64ad\u653e\u5668\u5f00\u59cb\u52a0\u8f7d\u97f3\u9891",
        feedback: {
            en: "Audio load started.",
            cn: "\u5f00\u59cb\u52a0\u8f7d\u97f3\u9891\u3002"
        }
    },
    60001 : {
        id: "60001",
        description: "\u6ca1\u6709\u521d\u59cb\u5316",
        feedback: {
            en: "Fatal speech kernal error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u5185\u6838\u6ca1\u6709\u521d\u59cb\u5316\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    60002 : {
        id: "60002",
        description: "\u6587\u4ef6\u7cfb\u7edf\u51fa\u9519",
        feedback: {
            en: "Fatal speech kernal error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u670d\u52a1\u5668\u51fa\u73b0\u5185\u90e8\u9519\u8bef\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    60003 : {
        id: "60003",
        description: "\u5185\u5b58\u5206\u914d\u51fa\u9519",
        feedback: {
            en: "Fatal speech kernal error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u670d\u52a1\u5668\u51fa\u73b0\u5185\u90e8\u9519\u8bef\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    },
    60004 : {
        id: "60004",
        description: "\u5185\u6838\u5904\u7406\u51fa\u73b0\u4e25\u91cd\u9519\u8bef",
        feedback: {
            en: "Fatal speech kernal error. Please contact us to report this.",
            cn: "\u8bed\u97f3\u670d\u52a1\u5668\u51fa\u73b0\u5185\u90e8\u9519\u8bef\uff0c\u8bf7\u4e0e\u6211\u4eec\u8054\u7cfb\u3002"
        }
    }
};
chivox.AiStatusCode.get = function(a, b) {
    var c = {
        id: a,
        description: "\u672a\u77e5\u9519\u8bef\u3002",
        state: "",
        feedback: {
            en: "Please try again.",
            cn: "\u8bf7\u91cd\u8bd5\u3002"
        }
    };
    if (a == "NO_DATA") c = {
        id: a,
        state: "NO_DATA",
        description: "\u6307\u5b9a\u4e4b\u95f4\u5185\u83b7\u53d6\u5f55\u97f3ID\u5931\u8d25",
        feedback: {
            en: "Recording failed, please try again.",
            cn: "\u5f55\u97f3\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    };
    else if (a == "TIMEOUT") c = {
        id: a,
        state: "TIMEOUT",
        description: "\u6307\u5b9a\u4e4b\u95f4\u5185\u8bc4\u5206\u5931\u8d25",
        feedback: {
            en: "Core request timeout, please try again.",
            cn: "\u8bc4\u5206\u8d85\u65f6\uff0c\u8bf7\u91cd\u8bd5\u3002"
        }
    };
    else if (typeof chivox.AiStatusCode[a] !== "undefined") {
        var g = chivox.AiStatusCode[a];
        c.id = g.id;
        c.state = g.state || "";
        c.description = g.description;
        c.feedback = g.feedback
    } else {
        g = a.toString().charAt(0);
        var e = parseFloat(a);
        if (e >= 0 && e <= 39999) c = chivox.AiStatusCode.default2;
        else if (e >= 4E4 & e <= 69999) c = chivox.AiStatusCode["default" + g]
    }
    c.feedback = b == "cn" ? c.feedback && c.feedback.cn || c.feedback: c.feedback && c.feedback.en || c.feedback;
    return c
};
chivox.AiTone = {
    __getToneModulus: function(a) {
        var b = [[0, 0, 0.47, 0, 0], [0, 0.5, -1.37, -1, 0], [0, -1, 0, 2, 0]],
            c = [];
        c[0] = a[0] * b[0][0] + a[1] * b[0][1] + a[2] * b[0][2] + a[3] * b[0][3] + a[4] * b[0][4];
        c[1] = a[0] * b[1][0] + a[1] * b[1][1] + a[2] * b[1][2] + a[3] * b[1][3] + a[4] * b[1][4];
        c[2] = a[0] * b[2][0] + a[1] * b[2][1] + a[2] * b[2][2] + a[3] * b[2][3] + a[4] * b[2][4];
        return c
    },
    getStandardCurve: function(a, b, c, g) {
        c = typeof c === "number" ? c: 0;
        var e = [],
            d = 4 / a;
        a = a * 1 / 4;
        var f = [0, 0, 0, 0, 0];
        if (b < 6 && b > 1) f[b - 1] = 1;
        f = this.__getToneModulus(f);
        for (j = 0; j < 3; j++) f[j] *= a;
        for (j = 0; j < 4; j += d) {
            tx = j * j * f[0] + j * f[1] + f[2] + c;
            e.push(tx)
        }
        if (typeof g != "undefined" && g == false) if (b == 1) for (var j in e) {
            if (e.hasOwnProperty(j) != false) e[j] += 50
        } else if (b == 2) for (j in e) {
            if (e.hasOwnProperty(j) != false) e[j] += 25
        } else if (b == 3) for (j in e) if (e.hasOwnProperty(j) != false) e[j] -= 25;
        return e
    },
    getUserCurve: function(a, b, c, g, e) {
        g = typeof g === "number" ? g: 0;
        var d = [],
            f = 4 / b;
        b = b * 1 / 4;
        if (a == null || a.length != 5) return null;
        var j = a[1] * 0.5 + a[2] * 0.25 - a[3] * 0.25,
            p = a[0] / 100;
        for (o = 1; o < a.length; o++) a[o - 1] = a[o] / 100;
        a[a.length - 1] = p;
        a = this.__getToneModulus(a);
        for (o = 0; o < 3; o++) a[o] *= b;
        for (o = 0; o < 4; o += f) d.push(o * o * a[0] + o * a[1] + a[2] + c + g);
        if (typeof e != "undefined" && e == false) for (var o in d) if (d.hasOwnProperty(o) != false) d[o] += j;
        return d
    }
};
chivox.CnSentRec = function(a) {
    this.data = a
};
chivox.CnSentRec.prototype.getParams = function() {
    return this.data.params
};
chivox.CnSentRec.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.CnSentRec.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.CnSentRec.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.CnSentRec.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.CnSentRec.prototype.getConf = function() {
    return this.data.result.conf
};
chivox.CnSentRec.prototype.getRec = function() {
    return this.data.result.rec
};
chivox.strtoutf8 = function(a) {
    for (var b = "",
             c = 0,
             g = c1 = c2 = 0; c < a.length;) {
        g = a.charCodeAt(c);
        if (g < 128) {
            b += String.fromCharCode(g);
            c++
        } else if (g > 191 && g < 224) {
            c2 = a.charCodeAt(c + 1);
            b += String.fromCharCode((g & 31) << 6 | c2 & 63);
            c += 2
        } else {
            c2 = a.charCodeAt(c + 1);
            c3 = a.charCodeAt(c + 2);
            b += String.fromCharCode((g & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            c += 3
        }
    }
    return b
};
chivox.CnAsrRec = function(a) {
    this.data = a
};
chivox.CnAsrRec.prototype.getParams = function() {
    return this.data.params
};
chivox.CnAsrRec.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.CnAsrRec.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.CnAsrRec.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.CnAsrRec.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.CnAsrRec.prototype.getRec = function() {
    return chivox.strtoutf8(this.data.result.rec)
};
chivox.CnSentScore = function(a) {
    this.data = a
};
chivox.CnSentScore.prototype.getParams = function() {
    return this.data.params
};
chivox.CnSentScore.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.CnSentScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.CnSentScore.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.CnSentScore.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.CnSentScore.prototype.getRank = function() {
    return this.data.result.rank
};
chivox.CnSentScore.prototype.getOverall = function() {
    return this.data.result.overall
};
chivox.CnSentScore.prototype.getPron = function() {
    return this.data.result.pron
};
chivox.CnSentScore.prototype.getPhn = function() {
    return this.data.result.phn
};
chivox.CnSentScore.prototype.getToneScore = function() {
    return this.data.result.tone
};
chivox.CnSentScore.prototype.getFluency = function() {
    return this.data.result.fluency.overall
};
chivox.CnSentScore.prototype.getCharSize = function() {
    return this.data.result.details.length
};
chivox.CnSentScore.prototype.getChar = function(a) {
    return new chivox.CnSentScore.Char(this.data.result.details[a])
};
chivox.CnSentScore.Char = function(a) {
    this.data = a
};
chivox.CnSentScore.Char.prototype.getConfidence = function() {
    return this.data.confidence
};
chivox.CnSentScore.Char.prototype.getChar = function() {
    return this.data["char"]
};
chivox.CnSentScore.Char.prototype.getTone = function() {
    return this.data.tone
};
chivox.CnSentScore.Char.prototype.getToneScore = function() {
    return this.data.tonescore
};
chivox.CnSentScore.Char.prototype.getPron = function() {
    return this.data.pron
};
chivox.CnSentScore.Char.prototype.getPhn = function() {
    return this.data.phn
};
chivox.CnSentScore.Char.prototype.getOverall = function() {
    return this.data.overall
};
chivox.CnSentScore.Char.prototype.getPhoneSize = function() {
    return this.data.phone.length
};
chivox.CnSentScore.Char.prototype.getPhone = function(a) {
    return new chivox.CnSentScore.Char.Phone(this.data.phone[a])
};
chivox.CnSentScore.Char.Phone = function(a) {
    this.data = a
};
chivox.CnSentScore.Char.Phone.prototype.getChar = function() {
    return this.data["char"]
};
chivox.CnSentScore.Char.Phone.prototype.getScore = function() {
    return this.data.score
};
chivox.CnWordScore = function(a) {
    this.data = a
};
chivox.CnWordScore.prototype.getParams = function() {
    return this.data.params
};
chivox.CnWordScore.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.CnWordScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.CnWordScore.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.CnWordScore.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.CnWordScore.prototype.getRank = function() {
    return this.data.result.rank
};
chivox.CnWordScore.prototype.getOverall = function() {
    return this.data.result.overall
};
chivox.CnWordScore.prototype.getPron = function() {
    return this.data.result.pron
};
chivox.CnWordScore.prototype.getPhn = function() {
    return this.data.result.phn
};
chivox.CnWordScore.prototype.getToneScore = function() {
    return this.data.result.tone
};
chivox.CnWordScore.prototype.getCharSize = function() {
    return this.data.result.details.length
};
chivox.CnWordScore.prototype.getChar = function(a) {
    return new chivox.CnWordScore.Char(this.data.result.details[a])
};
chivox.CnWordScore.Char = function(a) {
    this.data = a
};
chivox.CnWordScore.Char.prototype.getConfidence = function() {
    return this.data.confidence
};
chivox.CnWordScore.Char.prototype.getChar = function() {
    return this.data["char"]
};
chivox.CnWordScore.Char.prototype.getTone = function() {
    return this.data.tone
};
chivox.CnWordScore.Char.prototype.getToneScore = function() {
    return this.data.tonescore
};
chivox.CnWordScore.Char.prototype.getPron = function() {
    return this.data.pron
};
chivox.CnWordScore.Char.prototype.getPhn = function() {
    return this.data.phn
};
chivox.CnWordScore.Char.prototype.getOverall = function() {
    return this.data.overall
};
chivox.CnWordScore.Char.prototype.getPhoneSize = function() {
    return this.data.phone.length
};
chivox.CnWordScore.Char.prototype.getPhone = function(a) {
    return new chivox.CnWordScore.Char.Phone(this.data.phone[a])
};
chivox.CnWordScore.Char.Phone = function(a) {
    this.data = a
};
chivox.CnWordScore.Char.Phone.prototype.getChar = function() {
    return this.data["char"]
};
chivox.CnWordScore.Char.Phone.prototype.getScore = function() {
    return this.data.score
};
chivox.EnScoreMap = {
    ih: "\u026a",
    ax: "\u0259",
    oh: "\u0252",
    uh: "\u028a",
    ah: "\u028c",
    eh: "e",
    ae: "\u00e6",
    iy: "i:",
    er: "\u025c:",
    axr: "\u025a",
    ao: "\u0254:",
    uw: "u:",
    aa: "\u0251:",
    ey: "e\u026a",
    ay: "a\u026a",
    oy: "\u0254\u026a",
    aw: "a\u028a",
    ow: "\u04d9\u028a",
    ia: "\u026a\u0259",
    ea: "\u025b\u04d9",
    ua: "\u028a\u0259",
    p: "p",
    b: "b",
    t: "t",
    d: "d",
    k: "k",
    g: "g",
    l: "l",
    r: "r",
    m: "m",
    n: "n",
    ng: "\u014b",
    hh: "h",
    s: "s",
    z: "z",
    th: "\u03b8",
    dh: "\u00f0",
    f: "f",
    v: "v",
    w: "w",
    y: "j",
    sh: "\u0283",
    zh: "\u0292",
    ch: "t\u0283",
    jh: "d\u0292",
    get: function(a) {
        if (typeof chivox.EnScoreMap[a] === "string") return chivox.EnScoreMap[a];
        return a
    }
};
chivox.EnSentRec = function(a) {
    this.data = a
};
chivox.EnSentRec.prototype.getParams = function() {
    return this.data.params
};
chivox.EnSentRec.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.EnSentRec.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.EnSentRec.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.EnSentRec.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.EnSentRec.prototype.getConf = function() {
    return this.data.result.conf
};
chivox.EnSentRec.prototype.getRec = function() {
    return this.data.result.rec
};
chivox.EnSentScore = function(a) {
    this.data = a
};
chivox.EnSentScore.prototype.getParams = function() {
    return this.data.params
};
chivox.EnSentScore.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.EnSentScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.EnSentScore.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.EnSentScore.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.EnSentScore.prototype.getOverall = function() {
    return this.data.result.overall
};
chivox.EnSentScore.prototype.getPron = function() {
    return this.data.result.pron
};
chivox.EnSentScore.prototype.getFluency = function() {
    return this.data.result.fluency.overall
};
chivox.EnSentScore.prototype.getIntegrity = function() {
    return this.data.result.integrity
};
chivox.EnSentScore.prototype.getRhythm = function() {
    return this.data.result.rhythm.overall
};
chivox.EnSentScore.prototype.getAccuracy = function() {
    return this.data.result.accuracy
};
chivox.EnSentScore.prototype.getRank = function() {
    return this.data.result.rank
};
chivox.EnSentScore.prototype.getWordSize = function() {
    return typeof this.data.result.chars != "undefined" && this.data.result.chars.length > 0 ? this.data.result.chars.length: this.data.result.details.length
};
chivox.EnSentScore.prototype.getWord = function(a) {
    if (typeof this.data.result.chars != "undefined" && this.data.result.chars.length > 0) {
        for (var b = {
                "char": "",
                dur: 0,
                fluency: 0,
                score: 0,
                senseref: 0,
                sensescore: 0,
                stressref: 0,
                stressscore: 0,
                toneref: 0,
                tonescore: 0,
                liaison: 0
            },
                 c = 0, g = 0; g < a; g++) c += this.data.result.chars[g].normalize.length;
        a = this.data.result.chars[a];
        b["char"] = a["char"];
        for (g = 0; g < a.normalize.length; g++) {
            var e = this.data.result.details[c + g];
            b.dur += e.dur;
            b.fluency += e.fluency;
            b.score += e.score;
            b.senseref += e.senseref;
            b.sensescore += e.sensescore;
            b.stressref += e.stressref;
            b.stressscore += e.stressscore;
            b.toneref += e.toneref;
            b.tonescore += e.tonescore;
            b.liaison += e.liaison
        }
        b.fluency = Math.round(b.fluency / a.normalize.length);
        b.score = Math.round(b.score / a.normalize.length);
        b.sensescore = Math.round(b.sensescore / a.normalize.length);
        b.stressscore = Math.round(b.stressscore / a.normalize.length);
        b.tonescore = Math.round(b.tonescore / a.normalize.length)
    } else b = this.data.result.details[a];
    return new chivox.EnSentScore.Word(b)
};
chivox.EnSentScore.Word = function(a) {
    this.data = a
};
chivox.EnSentScore.Word.prototype.getChar = function() {
    return this.data["char"]
};
chivox.EnSentScore.Word.prototype.getDur = function() {
    return this.data.dur
};
chivox.EnSentScore.Word.prototype.getFluency = function() {
    return this.data.fluency
};
chivox.EnSentScore.Word.prototype.getScore = function() {
    return this.data.score
};
chivox.EnSentScore.Word.prototype.getStressRef = function() {
    return this.data.stressref
};
chivox.EnSentScore.Word.prototype.getStressScore = function() {
    return this.data.stressscore
};
chivox.EnSentScore.Word.prototype.getToneRef = function() {
    return this.data.toneref
};
chivox.EnSentScore.Word.prototype.getToneScore = function() {
    return this.data.tonescore
};
chivox.EnSentScore.Word.prototype.getLiaison = function() {
    return this.data.liaison
};
chivox.EnWordScore = function(a) {
    this.data = a
};
chivox.EnWordScore.prototype.getParams = function() {
    return this.data.params
};
chivox.EnWordScore.prototype.getRecordId = function() {
    return this.data.recordId
};
chivox.EnWordScore.prototype.getAudioUrl = function() {
    return this.data.audioUrl
};
chivox.EnWordScore.prototype.hasError = function() {
    var a = false;
    if (typeof this.data.result == "undefined" || typeof this.data.result.err != "undefined" || typeof this.data.result.error != "undefined" || typeof this.data.result.errID != "undefined") a = true;
    return a
};
chivox.EnWordScore.prototype.getErrorCode = function() {
    if (this.hasError()) return typeof this.data.result != "undefined" && this.data.result.errID != "undefined" ? this.data.result.errID: this.data.error
};
chivox.EnWordScore.prototype.getRank = function() {
    return this.data.result.rank
};
chivox.EnWordScore.prototype.getOverall = function() {
    return this.data.result.overall
};
chivox.EnWordScore.prototype.getWordSize = function() {
    return this.data.result.details.length
};
chivox.EnWordScore.prototype.getWord = function(a) {
    return new chivox.EnWordScore.Word(this.data.result.details[a])
};
chivox.EnWordScore.prototype.getCharSize = function() {
    return this.data.result.chars.length
};
chivox.EnWordScore.prototype.getChar = function(a) {
    return new chivox.EnWordScore.Char(this.data.result.chars[a])
};
chivox.EnWordScore.Word = function(a) {
    this.data = a
};
chivox.EnWordScore.Word.prototype.getChar = function() {
    return this.data["char"]
};
chivox.EnWordScore.Word.prototype.getDur = function() {
    return this.data.dur
};
chivox.EnWordScore.Word.prototype.getStress = function() {
    return this.data.stress
};
chivox.EnWordScore.Word.prototype.getScore = function() {
    return this.data.score
};
chivox.EnWordScore.Word.prototype.getPhoneSize = function() {
    if (typeof this.data.phone == "undefined") return 0;
    return this.data.phone.length
};
chivox.EnWordScore.Word.prototype.getPhone = function(a) {
    return new chivox.EnWordScore.Word.Phone(this.data.phone[a])
};
chivox.EnWordScore.Word.Phone = function(a) {
    this.data = a
};
chivox.EnWordScore.Word.Phone.prototype.getChar = function() {
    return this.data["char"]
};
chivox.EnWordScore.Word.Phone.prototype.getScore = function() {
    return this.data.score
};
chivox.EnWordScore.Char = function(a) {
    this.data = a
};
chivox.EnWordScore.Char.prototype.getChar = function() {
    return this.data["char"]
};
chivox.EnWordScore.Char.prototype.getNormalize = function() {
    return this.data.normalize
};
chivox.LocationSearch = {
    get: function() {
        var a = location.search,
            b = {};
        if (a != "" && a != "?") {
            a = a.substring(1).split("&");
            for (i in a) if (a.hasOwnProperty(i) != false) {
                var c = a[i].split("=");
                b[c[0]] = c[1]
            }
        }
        return b
    },
    set: function(a) {
        var b = "?";
        for (i in a) if (a.hasOwnProperty(i) != false) {
            if (b != "?") b += "&";
            b += i + "=" + a[i]
        }
        window.location.search = b;
        return a
    },
    has: function(a) {
        var b = this.get();
        for (i in b) if (b.hasOwnProperty(i) != false) if (i == a) return true;
        return false
    },
    attr: function(a, b) {
        var c = this.get();
        if (typeof a != "undefined") if (typeof b == "undefined") return c[a];
        else {
            c[a] = b;
            this.set(c)
        }
    }
};
chivox.SpeechResource = {}; (function() {
    var a = {
        scoreType: "100",
        coreType: "",
        refText: "",
        userId: "guest",
        applicationId: "default",
        mode: ""
    };
    chivox.SpeechResource.setScoreType = function(b) {
        a.scoreType = b
    };
    chivox.SpeechResource.setCoreType = function(b) {
        a.coreType = {
            cnword: "cn.word.score",
            cnsent: "cn.sent.score",
            enword: "en.word.score",
            ensent: "en.sent.score"
        } [b] || ""
    };
    chivox.SpeechResource.setRefText = function(b) {
        a.refText = b
    };
    chivox.SpeechResource.setUserId = function(b) {
        a.userId = b
    };
    chivox.SpeechResource.setApplicationId = function(b) {
        a.applicationId = b
    };
    chivox.SpeechResource.setMode = function(b) {
        a.mode = b
    };
    chivox.SpeechResource.get = function() {
        return a
    }
})();
ai$(function() {
    function a(b, c) {
        if (typeof b == "undefined") b = {};
        ai$.ajax({
            url: c,
            type: "GET",
            data: b.data,
            cache: false,
            dataType: "jsonp",
            jsonp: "jsonp",
            success: function(g, e) {
                typeof b.success == "function" && b.success(g, e)
            }
        })
    }
    chivox.jsLoadEnd = (new Date).getTime();
    chivox.updateMonitorLog = function(b) {
        b.logId = chivox.logId;
        b.tsLog = "" + (new Date).getTime();
        var c = chivox.monitorUrl;
        a({
                data: {
                    log: JSON.stringify(b)
                }
            },
            c)
    };
    chivox.updateMonitorLog({
        logType: "INSTANCELOG",
        logEvent: "JSSDKREADY",
        userAgent: navigator.userAgent,
        applicationURL: window.location.href,
        tsJSSDKInstanceStart: "" + chivox.jsLoadStart,
        timezoneOffset: (new Date).getTimezoneOffset(),
        jssdkVersion: chivox.jssdkVersion,
        tsJSSDKInstanceReady: "" + chivox.jsLoadEnd,
        flashVersion: chivox.AiFlashDetect.version,
        source: "SDK_JS"
    })
});