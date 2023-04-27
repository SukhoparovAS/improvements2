var comment_count=0;var process=false;var show_form;jQuery(document).ready(function()
{show_form=document.getElementsByClassName('form-show_comment')[0];if(show_form!=undefined)
{Load_Comment(true);document.getElementsByClassName('form-show_comment')[0].onclick=function()
{if(process==false)
{show_form.value='   VIEW MORE';show_form.style.backgroundImage="url('https://startgaming.net/wp-content/themes/StartGaming/css/svg/comment_load_2.svg')";show_form.style.backgroundPosition="10% 50%";Load_Comment(false);}}}});function Load_Comment(param=false)
{process=true;jQuery.ajax({url:myajax.url,type:'POST',dataType:'text',data:{action:'show_commentsss',commentcount:comment_count},success:function(comments)
{process=false;if(param)
{var comment_load=document.getElementById("comment_load");comment_load.remove();}
var coments=document.getElementsByClassName("product-rating__left_comments")[0];coments.insertAdjacentHTML('beforeend',comments);show_form.value='VIEW MORE';show_form.style.backgroundImage="none";comment_count+=5;},error:function(comments)
{process=false;}});}