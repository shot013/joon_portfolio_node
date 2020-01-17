function scrap() {
    $.ajax({
        url: './scrap',
        data : {
            keyword : $('#search_keyword').val()   
        },
        dataType: 'json',
//        async: false,
        success : (res) => {
            console.log("요청에의한 응답 :: " + res);
        },
        error : (res) => {
            console.dir(res);
        }
    })
}