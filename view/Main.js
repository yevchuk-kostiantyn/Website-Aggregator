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
        setCheckBoxes(obj);
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
            + '<button class="opener">Full Text</button>'
            + '<div class="dialog" title='+ obj[e]["interest"]+ '>'+obj[e]["text"]+'</div>';
    }
    jQuery(function($) {
        $('.opener').each(function() {
            $.data(this, 'dialog',
                $(this).next('.dialog').dialog({autoOpen: false,
                    maxWidth:600,
                    maxHeight: 500,
                    width: 600,
                    height: 500
                })
            );
        }).click(function() {
            $.data(this, 'dialog').dialog('open');
            return false;
        });
    });
    $('#results').html(html);
}

function setCheckBoxes(obj) {
    var html = '';
    for (var e in obj) {
        var charId = "char"+obj[e]["interest"];
        var interestValue = obj[e]["interest"];
        html += '<input type="checkbox" id='+ charId+ 'value=' + interestValue +  '/>'+interestValue;
    }
    $('#checkboxes').html(html);
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("articles_table");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function searchInArticle() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("articles_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}