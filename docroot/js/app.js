/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, white, unordered, long, for */

var app = {};
var  jt = {};

(function () {
    "use strict";

    ////////////////////////////////////////
    // local variables
    ////////////////////////////////////////

    var typing = { refidx:0, charidx:0, tms:100 };


    ////////////////////////////////////////
    // local helper functions
    ////////////////////////////////////////

    function displayResumeLink () {
        jt.out("reslinkdiv", jt.tac2html(
            ["a", {href:"ep.html",
                   onclick:jt.fs("window.open('ep.html')")},
              "view resume"]));
    }


    function typeContactInfo () {
        if(typing.refidx < typing.refs.length) {
            const ref = typing.refs[typing.refidx];
            if(ref.type !== "dyntxt" || (ref.href.length &&
                                         ref.href.length < ref.di)) {
                typing.refidx += 1; }
            else {  //dyntxt with output needed
                ref.di = ref.di || 0;
                ref.text = ref.text || "";
                ref.text += ref.href.slice(ref.di, ref.di + 1);
                if(ref.text.endsWith(" ")) {
                    ref.text = ref.text.slice(0, ref.text.length - 1);
                    ref.text += "&nbsp;"; }
                jt.out("dcrhref" + typing.refidx, ref.text);
                ref.di += 1; }
            setTimeout(typeContactInfo, typing.tms); }
        else {
            displayResumeLink(); }
    }


    function contactHTML (rdef, idx) {
        var ac; var sa; var aa;
        ac = rdef.text || "";
        if(rdef.type === "extimg") {
            ac = jt.tac2html(["img", {src:rdef.imgsrc}]); }
        sa = {id:"dcrspan" + idx, cla:"dcrspan"};
        if(rdef.type === "dyntxt") {
            sa.style = "min-width:" + (0.6 * rdef.href.length) + "em"; }
        aa = {id:"dcrhref" + idx, href:rdef.hpre + rdef.href};
        if(rdef.type !== "dyntxt") {
            aa.onclick = "window.open('" + rdef.href + "');return false;"; }
        rdef.hpre = rdef.hpre || "";
        return jt.tac2html(
            ["span", sa,
             ["a", aa, ac]]);
    }


    function displayContactInfo () {
        const refs = [
            {type:"dyntxt", hrpre:"mailto:", href:"$EMNAME@$HOSTNAME"},
            {type:"dyntxt", hrpre:"tel:", href:"+1 $GAC-237-0513"},
            {type:"extimg", //imgsrc:"https://github.com/favicon.ico",
             imgsrc:"img/github.ico", href:"https://github.com/theriex"},
            //cached local icon to avoid unnecessary service call.
            //Not in repository, refetch as needed.
            {type:"extimg", //imgsrc:"https://www.linkedin.com/favicon.ico",
             imgsrc:"img/in.ico", href:"https://www.linkedin.com/in/eparker"},
            // {type:"extimg", imgsrc:"img/twico.png",
            //  href:"https://twitter.com/theriex"},
            //site favicon currently missing, using local version
            {type:"extimg", imgsrc:"img/medico.png",
             href:"https://medium.com/@eric_89483"},
            {type:"exttxt", text:"South Boston, Massachusetts",
             href:"https://native-land.ca/maps/territories/massa-adchu-es-et-massachuset-2/"}];
        refs[0].href = refs[0].href.replace("$EMNAME", "eric");
        refs[0].href = refs[0].href.replace("$HOSTNAME", "epinova.com");
        refs[1].href = refs[1].href.replace("$GAC", "617");
        jt.out("contactdiv", jt.tac2html(
            refs.map((r, i) => contactHTML(r, i))));
        typing.refs = refs;
        setTimeout(typeContactInfo, typing.tms);
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
            const matches = lms.filter(function (substr) {
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
        const html = [];
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
        var src = event.target;
        jt.evtend(event);
        if(src.tagName.toLowerCase() === "img") {
            src = src.parentElement; }
        if(src) {
            window.open(src.href); }
    };


    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        addExpansionLinks();
        addFontSupport();
        convertExternalLinks();
        const params = jt.parseParams();
        if(params.view === "news") {
            app.selectContent("newsdiv"); }
        else {
            app.selectContent("capdiv"); }
        displayContactInfo();
        adjustNewsHeight();
    };

} () );

