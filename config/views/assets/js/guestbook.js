$(function(){

});

async function insert_comment() {
    let name = $('#name').val()
    let comment = $('#comment').val()
    let guest_info = {
        name: name,
        comment: comment,
        page: 1
    };

    if (name == '')     return alert('이름을 입력해주세요');
    if (comment == '')  return alert('내용을 입력해주세요');

    const guestbook_list = await guestbook_ajax(guest_info, 'post');
    console.log(guestbook_list);
}

function guestbook_ajax(guest_info, type) {
    return new Promise((resolve) => {
        const guest_list =  $.ajax({
                                url: './guest_book/add_guestbook',
                                data : guest_info,
                                type: type,
                                dataType: 'json',
                                success : async (res) => { return await res; },
                                error : (res) => { return alert('등록에 실패하였습니다. 잠시 후 다시 시도해주세요.'); }
                            });
        resolve(guest_list);
    });
}

{/* <tr>
<td>정원준</td>
<td colspan="2">방가방가</td>
<td>2020-02-02</td>
</tr> */}