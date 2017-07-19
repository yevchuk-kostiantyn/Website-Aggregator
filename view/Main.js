function sendConfiguration(URL, interest) {
    var xhr = new XMLHttpRequest();
    requestHandler(xhr);
    var config = JSON.stringify(
        {
            "URL": URL,
            "interest": interest
        });

    xhr.send(config);
    console.dir(config);
}

function requestHandler(xhr) {
    var url = "/patch";
    xhr.open("PATCH", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Data have been delivered!");
            console.log(typeof xhr.responseText)
        } else if (xhr.readyState === 4 && xhr.status === 400) {
            alert(xhr.responseText);
        }
    };
}

$(document).ready(function () {
    $.get("/articles", function (data) {
        var obj = JSON.parse(data);
        console.dir(obj);
        setConfigFields(obj);
    });

    document.getElementById("updateBtn").onclick = function () {
        sendConfiguration(
            document.getElementById('new_URL').value,
            document.getElementById('new_interest').value
        );
    };
});

function setConfigFields(obj) {
    var html ='';
    for (var e in obj) {
        html += '<tr>'
            + '<td>' + obj[e]["interest"] + '</td>' // Interest
            + '<td>' + obj[e]["url"] + '</td>' // URL
            + '<td>' + obj[e]["text"].substr(0, 70) + " ..."
            + '<button id="opener">Full Text</button>'
            + '<div id="dialog" title='+ obj[e]["interest"]+ '>'+obj[e]["text"]+'</div>';
        $(function () {
            $("#dialog").dialog({autoOpen: false,
                maxWidth:600,
                maxHeight: 500,
                width: 600,
                height: 500});
            $("#opener").click(function () {
                $("#dialog").dialog("open");
            });
        });
    }
    $('#results').html(html);
}



    // document.getElementById('URL').value = obj["URL"];
    // document.getElementById('interest').value = obj["interest"];


// Decode JSON and paste it to HTML table
// function showResults () {
//     var html = '';
//     for (var e in json) {
//         html += '<tr>'
//             +'<td>'+json[e].Name+'</td>' // Interest
//             +'<td>'+json[e].Type+'</td>' // URL
//             +'<td>'+json[e].Price+'</td>' // Article
//         +'</tr>';
//     }
//     $('#results').html(html);
// }

// Sort
$(function() {
    $('#headings th').click(function() {
        var id = $(this).attr('id');
        var asc = (!$(this).attr('asc')); // switch the order, true if not set
        
        // set asc="asc" when sorted in ascending order
        $('#headings th').each(function() {
            $(this).removeAttr('asc');
        });
        if (asc) $(this).attr('asc', 'asc');
        
        sortResults(id, asc);
    });
        
    //showResults();
});

function sortResults(prop, asc) {
    json = json.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]);
        else return (b[prop] > a[prop]);
    });
    showResults();
}

// Filters
var filterTable = function (HTMLTBodyRef, aFilters) {
    var rows = HTMLTBodyRef.getElementsByTagName("TR"),
        filters = {}, n,
        walkThrough = function (rows) {
            var tr, i, f;
            for (i = 0; i < rows.length; i += 1) {
                tr = rows.item(i);
                for(f in filters) {
                    if (filters.hasOwnProperty(f)) {
                        if (false === filters[f].validate(tr.children[f].innerText) ) {
                            tr.style.display = "none"; break;
                        } else {
                            tr.style.display = "";
                        }
                    }
                }
            }
        };
    for(n in aFilters) {
        if (aFilters.hasOwnProperty(n)) {
            if (aFilters[n] instanceof filterTable.Filter) {
                filters[n] = aFilters[n];
            } else {
                filters[n] = new filterTable.Filter(aFilters[n]);
            }
            filters[n]._setAction("onchange", function () {walkThrough(rows);});
        }
    }
};

// filterTable.Filter = function (HTMLElementRef, callback, eventName) {
//     /* If function was not called as constructor, fix it */
//     if (!(this instanceof arguments.callee)) {
//         return new arguments.callee(HTMLElementRef, callback, eventName);
//     }
//
//     /* Argument to string */
//     this.filters = {}.toString.call(HTMLElementRef) == "[object Array]" ? HTMLElementRef : [HTMLElementRef];
//
//     this.validate = function (cellValue) {
//         for (var i = 0; i < this.filters.length; i += 1) {
//             if ( false === this.__validate(cellValue, this.filters[i], i) ) {
//                 return false;
//             }
//         }
//     };
//
//     this.__validate = function (cellValue, filter, i) {
//         if (typeof callback !== "undefined") {
//             return callback(cellValue, this.filters, i);
//         }
//         /* If there are spaces, delete them */
//         filter.value = filter.value.replace(/^\s+$/g, "");
//         /* Input is equal to the value of cell */
//         return !filter.value || filter.value == cellValue;
//     };
//
//     this._setAction = function (anEventName, callback) {
//         for (var i = 0; i < this.filters.length; i += 1) {
//             this.filters[i][eventName||anEventName] = callback;
//         }
//     }
// };

function show(container, Message) {
    container.className = 'message';
    var msgElem = document.createElement('span');
    msgElem.className = "output-message";
    msgElem.innerHTML = Message;
    container.appendChild(msgElem);
}