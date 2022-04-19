/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, white, fudge, for, long */

var app = {};
var  jt = {};

(function () {
    "use strict";

    ////////////////////////////////////////
    // local variables
    ////////////////////////////////////////

    var typing = { refidx: 0, charidx: 0 };


    ////////////////////////////////////////
    // local helper functions
    ////////////////////////////////////////

    function displayResumeLink () {
        jt.out("reslinkdiv", jt.tac2html(
            ["a", {href:"ep.html",
                   onclick:jt.fs("window.open('ep.html')")},
              "view resume"]));
    }


    function displayContactLink (disp) {
        var ref = typing.refs[typing.refidx];
        if(ref.href) {
            disp = ["a", {href: ref.href, onclick: ref.onclick},
                    disp]; }
        jt.out("dcrspan" + typing.refidx, jt.tac2html(disp));
    }


    function typeContactInfo () {
        if(typing.refidx < typing.refs.length) {
            var ref = typing.refs[typing.refidx];
            if(ref.text) {
                var idx = typing.charidx;  //shorthand
                if(idx < ref.text.length) {
                    var sub; var ecs=["&nbsp;", "&#8209;"]; var isesc=false;
                    ecs.forEach(function (es) {
                        if(ref.text.indexOf(es, idx) === idx) {
                            sub = ref.text.slice(0, idx + es.length);
                            typing.charidx += es.length;
                            isesc = true; } });
                    if(!isesc) {
                        sub = ref.text.slice(0, idx);
                        typing.charidx += 1; }
                    displayContactLink(sub); }
                else {
                    displayContactLink(ref.text);
                    typing.refidx += 1;
                    typing.charidx = 0; } }
            else if(ref.imgsrc) {
                displayContactLink(jt.tac2html(
                    ["img", {src: ref.imgsrc, cla: "refimg"}]));
                typing.refidx += 1;
                typing.charidx = 0; }
            setTimeout(typeContactInfo, 100); }
        else {
            displayResumeLink(); }
        //redrawing the img doesn't cause the broken image to reload.  Caching
        //locally instead.
        // else {  //last call
        //     //redisplay images since the linkedin is particularly laggy and
        //     //can show up broken
        //     typing.refs.forEach(function (r, i) {
        //         if(r.imgsrc) {
        //             typing.refidx = i;
        //             displayContactLink(jt.tac2html(
        //                 ["img", {src: r.imgsrc, cla: "refimg"}])); } }); }
    }


    function displayContactInfo () {
        var emaddr = "ericEMSEPepinova.com";
        var telno = "+1&nbsp;617TELSEP237TELSEP0513";
        var inref = "https://www.linkedin.com/in/eparker";
        //inico = "https://www.linkedin.com/favicon.ico",
        //caching icon locally due to image loading issues on slower
        //connections.  Not in repository, refetch if needed.
        var inico = "img/in.ico";
        var twref = "https://twitter.com/theriex";
        var twico = "img/twico.png";
        var gitref = "https://github.com/theriex";
        var gitico = "https://github.com/favicon.ico";
        var landref = "https://native-land.ca/maps/territories/massa-adchu-es-et-massachuset-2/";
        emaddr = emaddr.replace(/EMSEP/g, "@");
        telno = telno.replace(/TELSEP/g, "&#8209;");
        var refs = [{text: "Contact:"},
                    {text: emaddr,
                     href: "mailto:" + emaddr},
                    {text: " "},  //space breaker
                    {text: telno,
                     href: "tel:" + telno},
                    {text: " "},  //space breaker
                    {imgsrc: gitico,
                     href: gitref,
                     onclick: jt.fs("window.open('" + gitref + "')")},
                    {text: " "},  //space breaker
                    {imgsrc: inico,
                     href: inref,
                     onclick: jt.fs("window.open('" + inref + "')")},
                    {text: " "},  //space breaker
                    {imgsrc: twico,
                     href: twref,
                     onclick: jt.fs("window.open('" + twref + "')")},
                    {text: " "},  //space breaker
                    {text: "South&nbsp;Boston,&nbsp;Massachusetts",
                     href: landref,
                     onclick: jt.fs("window.open('" + landref + "')")}];
        var html = [];
        refs.forEach(function (ignore /*ref*/, index) {
            html.push(["span", {id: "dcrspan" + index, cla: "dcrspan"}]); });
        jt.out("contactdiv", jt.tac2html(html));
        typing.refs = refs;
        setTimeout(typeContactInfo, 100);
    }


    //Sometimes there's a significant lag loading the fonts, and if
    //that is done in the index page then you are just sitting there
    //waiting for the site to display.  That's annoying and looks bad.
    //Need to avoid that problem, so load the fonts last.  This might
    //cause a blink in the display, but it's worth it to not have that
    //hideous lag occasionally.
    function addFontSupport () {
        var fontlink = document.createElement("link");
        fontlink.href = "//fonts.googleapis.com/css?family=Open+Sans:400,700";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
    }


    function filterNodesByTag (nodes, tagname) {
        var i; var elems = [];
        for(i = 0; i < nodes.length; i += 1) {
            if(nodes[i].nodeName.toLowerCase() === tagname.toLowerCase()) {
                elems.push(nodes[i]); } }
        return elems;
    }


    function addExpLinksToLi (index, divs) {
        var html;
        divs[1].setAttribute("id", "pd" + index);
        divs[2].setAttribute("id", "pm" + index);
        html = divs[1].innerHTML;
        html = [html,
                ["a", {id: "plink" + index, cla: "morelink", 
                       href: "#details",
                       onclick: jt.fs("app.toggleDetails(" + index + ")")},
                 "more..."]];
        divs[1].innerHTML = jt.tac2html(html);
    }


    function addExpansionLinks () {
        var elems = document.getElementsByClassName("pointsul");
        elems = filterNodesByTag(elems, "ul");
        elems.forEach(function (ul) {
            var lis = filterNodesByTag(ul.childNodes, "li");
            lis.forEach(function (li, index) {
                var divs = filterNodesByTag(li.childNodes, "div");
                addExpLinksToLi(index, divs); }); });
    }


    function shouldOpenInNewTab (link) {
        var nt=false;
        var lms = ["#", "https://epinova.com", "https://www.membic.org",
                   "http://epinova.com", "http://www.epinova.com",
                   "mailto"];
        if(link.className.indexOf("externaldocslink") >= 0) {
            nt = true; }
        if(!nt) {
            var matches = lms.filter(function (substr) {
                if(link.href.indexOf(substr) >= 0) {
                    return substr; } });
            nt = !(matches && matches.length); }
        return nt;
    }


    function convertExternalLinks () {
        var links = document.getElementsByTagName("a");
        var i; var link;
        for(i = 0; i < links.length; i += 1) {
            link = links[i];
            if(shouldOpenInNewTab(link)) {
                jt.on(link, "click", app.externalLinkClick); } }
    }


    function adjustNewsHeight () {
        var h = jt.byId("contentdiv").offsetHeight;
        h -= jt.byId("logodiv").offsetHeight;
        jt.byId("newsdiv").style.height = String(h) + "px";
    }


    ////////////////////////////////////////
    // application level functions
    ////////////////////////////////////////

    app.toggleDetails = function (index) {
        var detdiv = jt.byId("pm" + index);
        var morelink = jt.byId("plink" + index);
        if(detdiv.style.display === "block") {
            detdiv.style.display = "none";
            morelink.innerHTML = "more..."; }
        else {
            detdiv.style.display = "block";
            morelink.innerHTML = "less..."; }
    };


    app.selectContent = function (divid) {
        var pgs = [{divid:"capdiv", name:"About"},
                   {divid:"newsdiv", name:"Reading"},
                   {divid:"biodiv", name:"Bio"}];
        var sep = "&nbsp;&nbsp;&nbsp;&nbsp;";
        sep = sep + "|" + sep;
        var html = [];
        pgs.forEach(function (pg, idx) {
            if(pg.divid !== divid) {
                jt.byId(pg.divid).style.display = "none";
                html.push(["a", {href:"#" + pg.name,
                                 onclick:jt.fs("app.selectContent('" + 
                                               pg.divid + "')")},
                           pg.name]); }
            else {
                jt.byId(pg.divid).style.display = "block";
                html.push(pg.name); }
            if(idx < pgs.length - 1) {
                html.push(sep); } });
        jt.out("contseldiv", jt.tac2html(html));
    };


    app.externalLinkClick = function (event) {
        var src;
        jt.evtend(event);
        src = event.target || event.srcElement;
        if(src) {
            window.open(src.href); }
    };


    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        addExpansionLinks();
        addFontSupport();
        convertExternalLinks();
        var params = jt.parseParams();
        if(params.view === "news") {
            app.selectContent("newsdiv"); }
        else {
            app.selectContent("capdiv"); }
        displayContactInfo();
        adjustNewsHeight();
    };

} () );

