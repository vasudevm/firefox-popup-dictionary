//document.body.style.border = "5px solid red";

/* the API URL from which meanings are fetched */
/* var api_url = "https://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase=";*/
var api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

/* 'More...' link options
 *
 * TODO: Provide an option to add custom dictionary
 * with wildcard character '$$' replaced by the search term
 */
var wordnik_link = 'https://www.wordnik.com/words/';
var ddg_link = 'https://duckduckgo.com/?q=define+';

/* create the pop-up div element */
var define = document.createElement('div');
define.classList.add("dict-popup");
define.style["display"] = "none";
document.body.appendChild(define);

/* code to hide pop-up div on "click" event */
document.addEventListener("click", function(e) {
    if ((e.srcElement === define) || define.contains(e.target))
    {
        //console.log("clicked on dict pop-up");
    }
    else {
        //console.log(e);
        // clear the div and hide it
        define.innerHTML = '';
        define.style['display'] = 'none';
    }
});

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

document.addEventListener("dblclick", function(e) {
    var text = getSelectionText();
    var url = api_url + text;
    var limit = 3;
    console.log(e);
    console.log(text);
    console.log(url)

    $.ajax(
    {
        url: url,
        //dataType: 'jsonp',
        success: function(json) {
            
            console.log(Array.isArray(json))
            //alert(json[0].meanings[0].definitions[0].definition)
            if (Array.isArray(json))
            {
                if (json[0].meanings.length < limit)
                {
                    limit = json[0].meanings.length
                }
                define.innerHTML = '<h3 class="dict-word">' + json[0].word + '</h3>';
                if (limit == 1) {
                    list = '<div>' + json[0].meanings[0].definitions[0].definition +  '</div>'
                }
                else {
                    list = '<ul>';
                    for (i = 0; i < limit; ++i) {
                        list += '<li>' + json[0].meanings[i].definitions[0].definition + '</li>';
                    }
                    list += '</ul>';
                }
                list += '<div><a class="more_link" href="' + ddg_link + text + '" target="_blank">' + 'More >>' + '</a></div>';
                define.innerHTML += list;
            }
            /*
            if (json && json.result === "ok" && json.tuc.length > 0)
            {
                console.log("word: " + text + "(" + url + ")");
                if (json.tuc["0"].meanings.length < limit)
                {
                    limit = json.tuc["0"].meanings.length;
                }
                
                var meaning = json.tuc["0"].meanings[0].text;
                define.innerHTML = '<h3 class="dict-word">' + text + '</h3>';
                list = '<ul>';
                for (i = 0; i < limit; ++i) {
                    list += '<li>' + json.tuc["0"].meanings[i].text + '</li>';
                }
                list += '</ul>';
                list += '<a href="' + ddg_link + text + '" target="_blank">' + 'More...' + '</a>';
                define.innerHTML += list;
                
                
                
            }
            */
            // do not update position of pop-up div if selected word is contained within pop-up
           var domRect = define.getBoundingClientRect();
           var divX = domRect.x + window.scrollX;
           var divY = domRect.y + window.scrollY;
           //console.log('e.pageX: ' + e.pageX + '; e.pageY: ' + e.pageY + '; divX: ' + divX + '; divY: ' + divY);
           //console.log('define.offsetWidth: ' + define.offsetWidth + '; define.offsetHeight: ' + define.offsetHeight);
           if (!(((e.pageX > divX) && (e.pageX < divX + define.offsetWidth)) &&
               ((e.pageY > divY) && (e.pageY < divY + define.offsetHeight)))) {
               define.style['left']    = (e.pageX + 3) + 'px';
               define.style['top']     = (e.pageY + 6) + 'px';
           }
           define.style['display'] = 'block';

        },
        error: function(err) {
            console.log("err: " + err.responseText);
            // do not update position of pop-up div if selected word is contained within pop-up
            var domRect = define.getBoundingClientRect();
            var divX = domRect.x + window.scrollX;
            var divY = domRect.y + window.scrollY;
            //console.log('e.pageX: ' + e.pageX + '; e.pageY: ' + e.pageY + '; divX: ' + divX + '; divY: ' + divY);
            //console.log('define.offsetWidth: ' + define.offsetWidth + '; define.offsetHeight: ' + define.offsetHeight);
            if (!(((e.pageX > divX) && (e.pageX < divX + define.offsetWidth)) &&
                ((e.pageY > divY) && (e.pageY < divY + define.offsetHeight)))) {
                define.style['left']    = (e.pageX + 3) + 'px';
                define.style['top']     = (e.pageY + 6) + 'px';
            }
            define.style['display'] = 'block';
            define.innerHTML = '<h3 class="dict-word">' + text + '</h3><br>' + '<p>Could not find definitions.</p><br>';
            define.innerHTML += 'Search the web for: ' + '<a href="https://google.com/search?q=' + text + '" target="_blank">' + text + '</a>'
        }
    });

    
});