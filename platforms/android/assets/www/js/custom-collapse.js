$(document).ready(function()
{
  //hide the all of the element with class msg_body
  $(".msg_body").hide();
  //toggle the componenet with class msg_body
  $(".msg_head").click(function()
  {
      $(".msg_body").hide();
    $(this).next(".msg_body").slideToggle('fast');
  });
});