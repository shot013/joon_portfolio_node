function scrap() {
    console.log('click 전달');
    $.ajax({
        url: './scrap',
        data : {
            keyword : $('#search_keyword').val()   
        },
        dataType: 'json',
        success : (res) => {
            $('tbody .searches').remove();

            for(let i=0; i<res.naver.length; i++) {
                $('#naver').append(
                    '<tr class="searches">'+
                        '<td>' + res.naver[i].title + '</td>'+
                        '<td colspan="2">' + res.naver[i].text + '</td>'+
                        '<td>' + res.naver[i].blogName + '</td>'+
                        '<td>' + res.naver[i].regDate + '</td>'+
                    '</tr>'
                );
            }
                    
            for(let i=0; i<res.google.length; i++) {
                $('#google').append(
                    '<tr class="searches">'+
                        '<td>' + res.google[i].title + '</td>'+
                        '<td colspan="2">' + res.google[i].text + '</td>'+
                        '<td>' + res.google[i].blogName + '</td>'+
                        '<td>' + res.google[i].regDate + '</td>'+
                    '</tr>'
                );
            }
                    
            for(let i=0; i<res.daum.length; i++) {
                $('#daum').append(
                    '<tr class="searches">'+
                        '<td>' + res.daum[i].title + '</td>'+
                        '<td colspan="2">' + res.daum[i].text + '</td>'+
                        '<td>' + res.daum[i].blogName + '</td>'+
                        '<td>' + res.daum[i].regDate + '</td>'+
                    '</tr>'
                );
            }
        },
        error : (res) => {
            console.dir(res);
        }
    });
}