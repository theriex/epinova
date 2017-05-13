/*global jtminjsDecorateWithUtilities, document, setTimeout */
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
        var ref;
        if(typing.refidx < typing.refs.length) {
            ref = typing.refs[typing.refidx];
            if(ref.text) {
                if(typing.charidx < ref.text.length) {
                    displayContactLink(ref.text.slice(0, typing.charidx));
                    typing.charidx += 1; }
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
    }


    function displayContactInfo () {
        var emaddr = "ericEMSEPepinova.com",
            telno = "617TELSEP721TELSEP4350",
            inref = "https://www.linkedin.com/in/eparker",
            inico = "https://www.linkedin.com/favicon.ico",
            gitref = "https://github.com/theriex",
            gitico = "https://github.com/favicon.ico",
            refs, html = [];
        emaddr = emaddr.replace(/EMSEP/g, "@");
        telno = telno.replace(/TELSEP/g, "-");
        refs = [{text: "Contact:"},
                {text: emaddr,
                 href: "mailto:" + emaddr},
                {text: " "},  //space breaker
                {text: telno,
                 href: "tel:" + telno},
                {imgsrc: inico,
                 href: inref,
                 onclick: jt.fs("window.open('" + inref + "')")},
                {imgsrc: gitico,
                 href: gitref,
                 onclick: jt.fs("window.open('" + gitref + "')")},
                {text: " "}]; //space breaker
        refs.forEach(function (ignore /*ref*/, index) {
            html.push(["span", {id: "dcrspan" + index, cla: "dcrspan"}]); });
        html.push(["span", {id: "dcorgspan"},
                   jt.byId("contactdiv").innerHTML]);
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
        var height, html, sep;
        sep = "&nbsp;&nbsp;&nbsp;&nbsp;";
        sep = sep + "|" + sep;
        if(divid === "newsdiv") {
            jt.byId("newsdiv").style.display = "block";
            jt.byId("capdiv").style.display = "none";
            html = [["a", {href: "#capabilities",
                           onclick: jt.fs("app.selectContent('capdiv')")},
                     "About"],
                     sep,
                    "Tech&nbsp;News"]; }
        else if(divid === "capdiv") {
            jt.byId("newsdiv").style.display = "none";
            jt.byId("capdiv").style.display = "block";
            html = ["About",
                    sep,
                    ["a", {href: "#epnewtech",
                           onclick: jt.fs("app.selectContent('newsdiv')")},
                     "Tech&nbsp;News"]]; }
        jt.out("contseldiv", jt.tac2html(html));
    };


    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        addExpansionLinks();
        addFontSupport();
        app.selectContent("capdiv");
        displayContactInfo();
    };

} () );

