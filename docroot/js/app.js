/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, multivar, white, fudge, for */

var app = {},
    jt = {};

(function () {
    "use strict";

    ////////////////////////////////////////
    // local variables
    ////////////////////////////////////////

    var typing = { refidx: 0, charidx: 0 };


    ////////////////////////////////////////
    // local helper functions
    ////////////////////////////////////////

    function displayContactLink (disp) {
        var ref = typing.refs[typing.refidx];
        if(ref.href) {
            disp = ["a", {href: ref.href, onclick: ref.onclick},
                    disp]; }
        jt.out("dcrspan" + typing.refidx, jt.tac2html(disp));
    }


    function typeContactInfo () {
        var ref, sub, ecs = ["&nbsp;", "&#8209;"], isesc = false, idx;
        if(typing.refidx < typing.refs.length) {
            ref = typing.refs[typing.refidx];
            if(ref.text) {
                idx = typing.charidx;  //shorthand
                if(idx < ref.text.length) {
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
        var emaddr = "ericEMSEPepinova.com",
            telno = "617TELSEP721TELSEP4350",
            inref = "https://www.linkedin.com/in/eparker",
            //inico = "https://www.linkedin.com/favicon.ico",
            //caching icon locally due to image loading issues on slower
            //connections.  Not in repository, refetch if needed.
            inico = "img/in.ico",
            gitref = "https://github.com/theriex",
            gitico = "https://github.com/favicon.ico",
            refs, html = [];
        emaddr = emaddr.replace(/EMSEP/g, "@");
        telno = telno.replace(/TELSEP/g, "&#8209;");
        refs = [{text: "Contact:"},
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
                {text: "Boston,&nbsp;Massachusetts"}];
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
        var i, elems = [];
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
        var nt, matches,
            lms = ["#", "https://epinova.com", "https://www.membic.org",
                   "http://epinova.com", "http://www.epinova.com",
                   "mailto"];
        if(link.className.indexOf("externaldocslink") >= 0) {
            nt = true; }
        if(!nt) {
            matches = lms.filter(function (substr) {
                if(link.href.indexOf(substr) >= 0) {
                    return substr; } });
            nt = !(matches && matches.length); }
        return nt;
    }


    function convertExternalLinks () {
        var links, i, link;
        links = document.getElementsByTagName("a");
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
        var detdiv, morelink;
        detdiv = jt.byId("pm" + index);
        morelink = jt.byId("plink" + index);
        if(detdiv.style.display === "block") {
            detdiv.style.display = "none";
            morelink.innerHTML = "more..."; }
        else {
            detdiv.style.display = "block";
            morelink.innerHTML = "less..."; }
    };


    app.selectContent = function (divid) {
        var html, sep;
        sep = "&nbsp;&nbsp;&nbsp;&nbsp;";
        sep = sep + "|" + sep;
        if(divid === "newsdiv") {
            jt.byId("newsdiv").style.display = "block";
            jt.byId("capdiv").style.display = "none";
            html = [["a", {href: "#capabilities",
                           onclick: jt.fs("app.selectContent('capdiv')")},
                     "About"],
                     sep,
                    "Reading"]; }
        else if(divid === "capdiv") {
            jt.byId("newsdiv").style.display = "none";
            jt.byId("capdiv").style.display = "block";
            html = ["About",
                    sep,
                    ["a", {href: "#epnewtech",
                           onclick: jt.fs("app.selectContent('newsdiv')")},
                     "Reading"]]; }
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
        app.selectContent("capdiv");
        displayContactInfo();
        adjustNewsHeight();
    };

} () );

