;(function(factory){
    if(typeof(define) == "function" && define.amd){
        define(function(){ return factory(window); });
    } else {
        document.addEventListener("DOMContentLoaded", function(){
            factory(window);
        });
    }
}(function(root){
	"use strict";
    var w = root, d = root.document;

    /*
     |  HELPER METHODs
     */
    var tail = {
        each: function(elements, callback, end_callback){
            if(typeof callback !== "function"){
                return false;
            }

            if(elements instanceof HTMLElement || elements instanceof Element){
                callback.call(elements, 1);
            } else if(elements instanceof NodeList || elements instanceof HTMLCollection){
                for(var i = 0; i < elements.length; i++){
                    callback.call(elements[i], (i+1));
                }
            }
            if(typeof end_callback == "function"){
                end_callback.call(elements);
            }
        },
        hasClass: function(e, name){
            return (new RegExp("(|\s+)" + name + "(\s+|)")).test(e.className);
        },
        addClass: function(e, name){
            if(!(new RegExp("(|\s+)" + name + "(\s+|)")).test(e.className)){
                e.className = (e.className.trim() + " " + name.trim()).trim();
            }
            return e;
        },
        removeClass: function(e, name){
            var regex = new RegExp("(|\s+)(" + name + ")(\s+|)");
            if(regex.test(e.className)){
                e.className = (e.className.replace(regex, "$1$3")).trim();
            }
            return e;
        }
    };

	/*
	 |	TOOLTIP
	 */
    var tooltipID = 0,
        tooltip = function(event){
        event.preventDefault();
        if(event.type === "mouseenter"){
            if(!this.hasAttribute("data-tooltip-id")){
                var element = d.createElement("DIV");
                    element.id = "tooltip-" + ++tooltipID;
                    element.innerText = this.getAttribute("data-tooltip");
                    element.className = "tooltip";
                    element.style.opacity = 0;
                    element.style.display = "block";
                    d.body.appendChild(element);

                // Get Position
                var position = function(element){
                    var position = {
                        top:    element.offsetTop    || 0,
                        left:   element.offsetLeft   || 0,
                        width:  element.offsetWidth  || 0,
                        height: element.offsetHeight || 0
                    };
                    while(element = element.offsetParent){
                        position.top  += element.offsetTop;
                        position.left += element.offsetLeft;
                    }
                    return position;
                }(this);

                // Calculate Position
                element.style.top = (position.top + position.height) + "px";
                element.style.left = (position.left + (position.width / 2) - (element.offsetWidth / 2)) + "px";

                // Add to Element
                this.setAttribute("data-tooltip-id", "tooltip-" + tooltipID);
            }
            tail.addClass(d.querySelector("#" + this.getAttribute("data-tooltip-id")), "active");
        } else if(event.type === "mouseleave"){
            if(this.hasAttribute("data-tooltip-id")){
                var element = d.querySelector("#" + this.getAttribute("data-tooltip-id"));
                tail.removeClass(element, "active");
                this.removeAttribute("data-tooltip-id");
                (function(e){
                    setTimeout(function(){ e.parentElement.removeChild(e); }, 150);
                })(element);
            }
        }
    };

    /*
     |  TOGGLE SOURCE CODE
     */
    var source = function(event){
        var container = this.nextElementSibling;
        if(!tail.hasClass(container, "active")){
            var coptainer = container.cloneNode(true);
                coptainer.style.height = "auto";
                coptainer.style.position = "absolute";
                coptainer.style.visibility = "hidden";
                coptainer.className += " active";

            this.parentElement.appendChild(coptainer);
            var height = coptainer.offsetHeight;
            this.parentElement.removeChild(coptainer);

            this.innerText = "Hide Example Code";
            tail.addClass(this, "active");
            tail.addClass(container, "active");
            container.style.height = height + "px";
        } else {
            container.removeAttribute("style");
            this.innerText = "Show Example Code";
            tail.removeClass(this, "active");
            tail.removeClass(container, "active");
        }
    }

    // Ready
    tail.each(d.querySelectorAll("ul.sub-navi"), function(){
        var clone = this.cloneNode(true);
            clone.style.cssText = "z-index:-1;opacity:0;display:block;visibility:hidden;";
            this.parentElement.appendChild(clone);

        (function(el, main){
            setTimeout(function(){
                var width = el.offsetWidth;
                el.parentElement.removeChild(el);
                main.style.left = "50%";
                main.style.marginLeft = "-" + (width/2) + "px";
            }, 150);
        }(clone, this));
    });

    // Init Tooltips
    tail.each(d.querySelectorAll("*[data-tooltip]"), function(){
        this.addEventListener("mouseenter", tooltip);
        this.addEventListener("mouseleave", tooltip);
    });

    // Init ScrollSpy
    tail.each(d.querySelector("*[data-handle='menuspy']"), function(){
        new MenuSpy(this);
    });

    // Toggle Source Code
    tail.each(d.querySelectorAll("*[data-handle='example']"), function(){
        this.addEventListener("click", source);
    });

    // Connect Select Fields
    tail.each(d.querySelectorAll("select[data-connect]"), function(){
        var source = d.querySelector(this.getAttribute("data-connect")), self = this;
        if(!source){
            return false;
        }

        var change = function(source, result){
            tail.each(result.options, function(){
                this.style.display = "none";
            });
            tail.each(result.querySelectorAll("[data-value='" + source.value + "']"), function(i){
                this.style.removeProperty("display");
                this.selected = (i == 1);
            });
        };
        source.addEventListener("change", function(event){
            change(event.target, self);
        });
        change(source, this);
    });
}));
