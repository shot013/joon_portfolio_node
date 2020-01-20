function scrap() {
    console.log('click 전달');
    $.ajax({
        url: './scrap',
        data : {
            keyword : $('#search_keyword').val()   
        },
        dataType: 'json',
        success : (res) => {
            console.log("요청에의한 응답 :: " + res);
        },
        error : (res) => {
            console.dir(res);
        }
    })
}