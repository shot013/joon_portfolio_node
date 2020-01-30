function scrap() {
    $.ajax({
        url: './search_toon',
        data : {
            portal : $('#portal').val(),
            toon : $('#toon').val()   
        },
        dataType: 'json',
        success : (res) => {
            console.log(res);
            $('#search_toons tr').remove();
            if (res != 0) { 
                for(let i=0; i<res.length; i++) {
                    $('#search_toons').append(
                        '<tr>'
                            +'<td>' + res[i].title + '</td>'
                            +'<td>' + res[i].regDate + '</td>'
                            +'<td>' + res[i].pointNum + '</td>'
                            +'<td>' + res[i].pointPer + '</td>'
                        +'</tr>'
                    );
                }
            } else {
                $('#search_toons').append('<tr><td style="text-align:center;" colspan="4">해당 웹툰을 찾을 수가 없습니다. 웹툰 및 플랫폼을 확인해주세요.</td></tr>');
            }
        },
        error : (res) => {
            console.dir(res);
        }
    });
}