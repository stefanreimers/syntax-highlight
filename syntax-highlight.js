"use strict";
class SyntaxHighlightingElement extends HTMLPreElement{

	connectedCallback(){
    this.highlight();
	}

	highlight(){
        
		var reserved = /^(await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield)$/i,

        i,
        nodesToHighlight,
        el;

		  // nodes to highlight
        nodesToHighlight = [this];

        for (i = 0; el = nodesToHighlight[i++];) {

            var text  = el.textContent,
                pos   = 0,       // current position
                next1 = text[0], // next character
                nextChar,
                chr   = 1,       // current character
                prev1,           // previous character
                prev2,           // the one before the previous
                token =          // current token content
                el.innerHTML = '',  // (and cleaning the node)
                
                // current token type:
                //  0: anything else (whitespaces / newlines)
                //  1: operator or brace
                //  2: closing braces (after which '/' is division not regex)
                //  3: (key)word
                //  4: regex
                //  5: string starting with "
                //  6: string starting with '
                //  7: xml comment  <!-- -->
                //  8: multiline comment /* */
                //  9: single-line comment starting with two slashes //
                // 10: single-line comment starting with hash #
                tokenType = 0,

                // kept to determine between regex and division
                lastTokenType,
                displayTokenType,
                lastToken,
                // flag determining if token is multi-character
                multichar,
                node;


            // running through characters and highlighting
            while (prev2 = prev1,
                   // escaping if needed (with except for comments)
                   // pervious character will not be therefore
                   // recognized as a token finalize condition
                   prev1 = tokenType < 7 && prev1 == '\\' ? 1 : chr
            ) {
                chr = next1;
                nextChar = text[pos];
                next1=text[++pos];
                multichar = token.length > 1;

                // checking if current token should be finalized
                if (!chr  || // end of content
                    // types 9-10 (single-line comments) end with a
                    // newline
                    (tokenType > 8 && chr == '\n') ||
                    [ // finalize conditions for other token types
                        // 0: whitespaces
                        /\S/.test(chr),  // merged together
                        // 1: operators
                        1,                // consist of a single character
                        // 2: braces
                        1,                // consist of a single character
                        // 3: (key)word
                        !/[$\w]/.test(chr),
                        // 4: regex
                        (prev1 == '/' || prev1 == '\n') && multichar,
                        // 5: string with "
                        prev1 == '"' && multichar,
                        // 6: string with '
                        prev1 == "'" && multichar,
                        // 7: xml comment
                        text[pos-4]+prev2+prev1 == '-->',
                        // 8: multiline comment
                        prev2+prev1 == '*/'
                    ][tokenType]
                ) {
                    // appending the token to the result
                    if (token) {
                        // remapping token type into style
                        // (some types are highlighted similarly)

                        displayTokenType = tokenType;
                        if( tokenType == 3 && reserved.test(token) ) displayTokenType = 'reserved';
                        if( tokenType == 3 && lastToken == '.') displayTokenType = 'function';


                        el.appendChild(
                            node = document.createElement('span')
                        )
						.classList.add('token-type-' + displayTokenType );
            
                        node.appendChild(document.createTextNode(token));
                    }

                    // saving the previous token type
                    // (skipping whitespaces and comments)
                    lastTokenType =
                        (tokenType && tokenType < 7) ?
                        tokenType : lastTokenType;

                    lastToken = token;
                    // initializing a new token
                    token = '';

                    // determining the new token type (going up the
                    // list until matching a token type start
                    // condition)
                    tokenType = 11;
                    while (![
                        1,                   //  0: whitespace
                                             //  1: operator or braces
                        /[\/{}[(\-+*=<>:;|\\.,?!&@~]/.test(chr),
                        /[\])]/.test(chr),  //  2: closing brace
                        /[$\w]/.test(chr),  //  3: (key)word
                        chr == '/' &&        //  4: regex
                            // previous token was an
                            // opening brace or an
                            // operator (otherwise
                            // division, not a regex)
                            (lastTokenType < 2) &&
                            // workaround for xml
                            // closing tags
                            prev1 != '<',
                        chr == '"',          //  5: string with "
                        chr == "'",          //  6: string with '
                                             //  7: xml comment
                        chr+next1+text[pos+1]+text[pos+2] == '<!--',
                        chr+next1 == '/*',   //  8: multiline comment
                        chr+next1 == '//',   //  9: single-line comment
                        chr == '#'           // 10: hash-style comment
                    ][--tokenType]);
                }

                token += chr;
            }
        }
    }
	
}

window.customElements.define('syntax-highlight', SyntaxHighlightingElement, {extends: "pre"});

(function (w, d) {
  let style = d.createElement('STYLE');
  style.textContent = `syntax-highlight {
    background: #eee;
    color: #333;
    white-space: pre-wrap;
    display:block;
    overflow-x: auto;
    font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", 
"Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", 
"Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
    tab-size: 2;
    padding: 5px .5rem;
    box-sizing: border-box;
  }

  syntax-highlight[data-lang]::before {
    content: attr(data-lang);
    display: block;
    padding: 5px;
    border-bottom: 1px solid #ddd
  }

  syntax-highlight .token-type-1,
  syntax-highlight .token-type-2 {
    color: #9a6e3a;
  }

  syntax-highlight .token-type-3 {
    color: black
  }

  syntax-highlight .token-type-4 {
    color: #f22c40
  }

  syntax-highlight .token-type-5,
  syntax-highlight .token-type-6 {
    color: #690;
  }

  syntax-highlight .token-type-7,
  syntax-highlight .token-type-8,
  syntax-highlight .token-type-9,
  syntax-highlight .token-type-10 {
    color: #708090; font-style: italic;
  }

  syntax-highlight .token-type-reserved {
    color: #07a; font-weight: bold;
  }

  syntax-highlight .token-type-function{
    color: #dd4a68
  } 
    `;
    d.head.appendChild(style);
})(window, document);
