require(["prism.min", "menuspy.min", "tail.demo", "source/tail.select", "langs/tail.select-all"], function(prism, menu, website, select, languages){
    "use strict";
    var w = window, d = window.document, holder = [];

    /*
     |  INIT LANGUAGES
     */
    languages(select);

    /*
     |  AJAX FUNCTION
     */
    var href = window.location.href.slice(0, window.location.href.lastIndexOf("/")+1);
    var ajax = function(value, callback, argument){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                callback(JSON.parse(this.responseText), argument);
            }
        };
        xhttp.open("GET", href + "assets/data/demo." + value + ".json", true);
        xhttp.send();
    }

    /*
     |  GENERAL ACTIONS
     */
    var link = function(source){
        d.head.insertAdjacentHTML("beforeend", '<style id="tail-exchange">.tail-select{ display:none !important; }</style>');
        d.querySelector("link#main-sheet").href = source;
        setTimeout(function(){
            d.head.removeChild(d.querySelector("style#tail-exchange"));
        }, 500);
    };
    d.querySelector("select#change-design").addEventListener("change", function(){
        var self = this;
        holder.forEach(function(inst){
            inst.config("classNames", [self.value, "default"]);
        });
        link("source/css/tail.select-" + this.value + ".css");
    });
    d.querySelector("select#change-color").addEventListener("change", function(){
        var source = "source/css/";
        var theme = d.querySelector(this.getAttribute("data-connect")).value;
        switch(theme){
            case "default":     //@Fallthrough
            case "modern":
                if(this.value == "white"){
                    source += "tail.select-" + theme + ".css";
                } else {
                    source += "tail.select-" + theme + "-" + this.value + ".css";
                }
                break;
            case "bootstrap2":  //@Fallthrough
            case "bootstrap3":  //@Fallthrough
            case "bootstrap4":
                if(this.value == "default"){
                    source += "tail.select-" + theme + ".css";
                } else {
                    source += theme + "/" + this.value + ".css";
                }
                break;
        }
        var self = this;
        holder.forEach(function(inst){
            inst.config("classNames", [theme, self.value]);
        });
        link(source);
    });
    d.querySelector("select#change-locale").addEventListener("change", function(){
        var locale = this.value;
        holder.forEach(function(inst){
            inst.config("locale", locale);
        });
    });
    d.querySelector("select#change-design").options.selectedIndex = 0;
    d.querySelector("select#change-color").options.selectedIndex = 0;
    d.querySelector("select#change-locale").options.selectedIndex = 0;

    /*
     |  HEADER DEMONSTRATION
     */
    holder = holder.concat(select("#select-special", {
        search: true,
        animate: true,
        classNames: "default white",
        descriptions: true,
        multiSelectAll: true
    }));

    /*
     |  CONTENT EXAMPLES
     */
    holder = holder.concat(select(".select", {
        classNames: "default white"
    }));
    holder = holder.concat(select(".select-move1", {
        search: true,
        classNames: "default white",
        descriptions: true,
        hideSelected: true,
        hideDisabled: true,
        multiLimit: 15,
        multiShowCount: false,
        multiContainer: ".tail-move-container"
    }));
    holder = holder.concat(select(".select-move2", {
        search: true,
        classNames: "default white",
        descriptions: true,
        hideSelected: true,
        hideDisabled: true,
        multiLimit: 15,
        multiShowCount: false,
        multiContainer: true
    }));

    /*
     |  HOOKED EXAMPLE
     */
    holder = holder.concat(select(".select-hooked", {
        search: true,
        classNames: "default white",
        descriptions: true,
        multiSelectAll: true,
        cbLoopItem: function(item, optgroup, search, root){
            var li = d.createElement("LI");
                li.className = "dropdown-option" + ((item.selected)? " selected": "") + ((item.disabled)? " disabled": "");

            // Inner Text
            if(search){
                var pos = item.option.innerHTML.search(/[^\s]/i)/2,
                    path = d.createElement("SPAN"), text = [], el = item.option, i = 0;
                while(el = el.previousElementSibling){
                    if(i++ >= pos){
                        break;
                    }
                    text.push(el.innerText);
                }
                path.className = "options-path";
                path.innerText = text.reverse().join(" > ");
                li.innerHTML += path.outerHTML;
                li.innerHTML += item.value.replace(new RegExp("(" + search + ")", "i"), "<mark>$1</mark>");
            } else {
                li.innerHTML += item.option.innerHTML.replace(/ /g, "&nbsp;&nbsp;");
            }

            // Inner Description
            if(this.con.descriptions && item.description){
                li.innerHTML += '<span class="option-description">' + item.description + '</span>';
            }
            return li;
        }
    }).on("open", function(){
        d.querySelector("#hook-latest").innerText = "Open Select Field";
    }).on("close", function(){
        d.querySelector("#hook-latest").innerText = "Close Select Field";
    }).on("change", function(item, state){
        var text = state[0].toUpperCase() + state.slice(1);
        d.querySelector("#hook-latest").innerText = text + " Option: '" + item.key + "'";
    }));

    /*
     |  MANIPULATION EXAMPLE
     */
    var first = select(".select-mani-main", {
        classNames: "default white",
        descriptions: true,
        deselect: true,
        stayOpen: null,
        sortItems: "ASC"
    });
    var games = select(".select-main-games", {
        search: true,
        classNames: "default white",
        descriptions: true,
        sortGroups: "ASC",
        sortItems: "ASC",
        placeholder: "Select some Games...",
        multiPinSelected: true
    });
    games.updateLabel("← Select a Developer first!");

    // Hook First
    first.on("change", function(item, state){
        if(state !== "select"){
            return;
        }
        console.log(item.group);
        if(item.group == "Remove Developer"){
            switch(item.key){
                case "activision":  //@Fallthrough
                case "bethesda":    //@Fallthrough
                case "ubisoft":     //@Fallthrough
                case "bioware":     //@Fallthrough
                case "deep-silver":
                    var val = (item.key == "bioware")? "BioWare": item.key;
                    val = val.replace("-", " ").replace(/(?:^\w|[A-Z]|\b\w)/g, function(m, i){
                        return m.toUpperCase();
                    });
                    break;
                case "cd-project":
                    var val = "CD Project RED";
                    break;
            }
            if(val){
                first.options.unselect(item.key, item.group, true);
                first.disable();

                var items = [].concat(Object.keys(games.options.items[val]));
                for(var l = items.length, i = 0; i < l; i++){
                    games.options.remove(items[i], val, false);
                }
                games.query();
                games.updateLabel("← Select a Developer first!");

                first.enable();
                first.options.move(item, undefined, "#");
            }
        } else {
            first.options.unselect(item.key, item.group, true);
            first.disable();
            ajax(item.key, function(items){
                games.options.add(items);
                first.enable();
                first.options.move(item, undefined, "Remove Developer", true);
            });
        }
    });
});
