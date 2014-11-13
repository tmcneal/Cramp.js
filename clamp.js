/*!
* Cramp.js 0.1.0
*
* Copyright 2011-2013, Joseph Schmitt http://joe.sh
* Released under the WTFPL license
* http://wtfpl.org
*
* Copyright (c) 2014 by Curalate, Inc.
*
*/

(function(window){

    var TEXT_NODE = 3,
        DEFAULT_MAX_LINES = 2;

// UTILITY FUNCTIONS __________________________________________________________

    /**
     * Return the current style for an element.
     * @param {HTMLElement} element The element to compute.
     * @param {string} prop The style property.
     * @returns {number}
     */
    function computeStyle(element, prop) {
        if (!window.getComputedStyle) {
            window.getComputedStyle = function(el) {
                this.el = el;
                this.getPropertyValue = function(prop) {
                    var re = /(\-([a-z]){1})/g;
                    if (prop == 'float') prop = 'styleFloat';
                    if (re.test(prop)) {
                        prop = prop.replace(re, function () {
                            return arguments[2].toUpperCase();
                        });
                    }
                    return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
                }
                return this;
            }
        }

        return window.getComputedStyle(element, null).getPropertyValue(prop);
    };

    /**
     * Returns the maximum number of lines of text that should be rendered based
     * on the current height of the element and the line-height of the text.
     */
    function getMaxLines(element, height) {
        var availHeight = height || element.clientHeight,
            lineHeight = getLineHeight(element);

        return Math.max(Math.floor(availHeight/lineHeight), 0);
    };

    /**
     * Returns the line-height of an element as an integer.
     */
    function getLineHeight(element) {
        var lh = computeStyle(element, 'line-height');
        if (lh == 'normal') {
            // Normal line heights vary from browser to browser. The spec recommends
            // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
            lh = parseInt(computeStyle(element, 'font-size')) * 1.2;
        }
        return parseInt(lh);
    };

    function getElementHeight(element) {
        return element.clientHeight;
    };

    /**
     * Returns the max number of lines we will allow before cramping.
     */
    function parseCrampValue(crampValue) {
        var isCSSValue;

        if (!crampValue) {
            return DEFAULT_MAX_LINES;
        }

        isCSSValue = crampValue.indexOf && (crampValue.indexOf('px') > -1 || crampValue.indexOf('em') > -1);

        if (crampValue == 'auto') {
            return getMaxLines(element);
        }
        else if (isCSSValue) {
            return getMaxLines(element, parseInt(crampValue));
        } else {
            return crampValue;
        }
    };

    /**
     * Cramps a text node.
     * @param {HTMLElement} element. Element containing the text node to clamp.
     */
    function cramp(element, opts) {
        var options = opts || {},
            original = element.innerHTML,
            cramped,
            maxLines = parseCrampValue(options.cramp || 2),
            truncationText = options.truncationChar || "…";

        var truncate = function(maxLines) {
            var i, text, parentNode, spaceIndex,
                nodes = element.childNodes;

            for (i = nodes.length - 1; i >= 0; i--) {
                node = nodes[i],
                parentNode = node.parentNode;

                if (node.nodeType === TEXT_NODE) {
                    text = node.nodeValue;
                    while (text.length > 0) {

                        spaceIndex = text.lastIndexOf(" ");

                        if (spaceIndex != -1) {
                            // Remove the last word
                            text = text.slice(0, spaceIndex);
                        } else {
                            // Remove the last letter
                            text = text.slice(0, text.length - 1);
                        }

                        // Strip word/letter and add the "..." string
                        node.nodeValue = text + truncationText;

                        // Does the content fit?
                        if (isCramped(maxLines)) {
                            return element.innerHTML;
                        } else {
                            text = text.slice(0, text.length - truncationText.length); // Remove the "..." string
                        }
                    }

                    // We've removed all the text and it's not cramped yet - remove the node itself
                    parentNode.removeChild(node);

                } else {

                    // Remove the last element
                    parentNode.removeChild(node);

                    // Add the "..." string
                    parentNode.appendChild(new Text(truncationText));

                    // Does the content fit?
                    if (isCramped(maxLines)) {
                        return element.innerHTML;
                    } else {
                        parentNode.removeChild(parentNode.lastChild); // Remove the "..." string
                    }
                }
            }

            return element.innerHTML;
        };

        var isCramped = function(lines) {
            return getLineHeight(element) * lines >= getElementHeight(element);
        };

// CONSTRUCTOR ________________________________________________________________

        if (isCramped(maxLines)) {
            cramped = null;
        } else {
            cramped = truncate(maxLines);
        }

        return {
            'original': original,
            'cramped': cramped
        };
    }

    window.$cramp = cramp;

})(window);
