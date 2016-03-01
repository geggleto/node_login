/**
 * Created by Glenn on 2016-03-01.
 */

jQuery(document).ready(function () {
    var alertDiv = jQuery('#alert');

    alertDiv.hide();

    jQuery('#signin').click(function (e) {
        jQuery.ajax({
            url: "/auth",
            method: "POST",
            data : {
                username : jQuery("#username").val(),
                password : jQuery("#password").val()
            },
            beforeSend: function () {
                alertDiv.hide();
            },
            statusCode : {
                403 : function () { //Incorrect Username or Password
                    this.displayMessage("Incorrect Login Name or Password");
                },
                500 : function () { //Server Error
                    this.displayMessage("Auth service unavailable");
                },
                404 : function () {
                    this.displayMessage("Auth service unavailable");
                }
            },
            success: function(response) { //200
                alert("YAY!");
            },
            displayMessage : function (msg) {
                alertDiv.show();
                alertDiv.html(msg);
            }
        });
    });
});
