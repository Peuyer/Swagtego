let logger = (function(){

    function postLog(username) {
        console.log(username);
        $.ajax({
            type: "POST",
            url: "/html/",
            data: {
                login: username
            },
            success: () => {
                window.location.href = '../../../html/';
            },
        });
    }

    return {
        sendLogin(username) {
            postLog(username);
        }
    }
})();


//window.location.href = '../../../html/index.html';