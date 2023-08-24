class ChatEngine{constructor(e,t){this.chatbox=$("#"+e),this.userEmail=t,this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let s=this;this.socket.on("connect",function(){console.log("Connection Established using sockets!"),s.socket.emit("join_room",{user_email:s.userEmail,chatroom:"VirtualHub"}),s.socket.on("user_joined",function(e){console.log("A user has joined",e)})}),$("#send-message").click(function(e){e.preventDefault();e=$("#message").val();""!=e&&($("#message").val(""),s.socket.emit("send_message",{message:e,user_email:s.userEmail,chatroom:"VirtualHub"}))}),s.socket.on("recieve_message",function(e){console.log("Recieved some message!",e);var t=$("<li>");let o="other-message";e.user_email==s.userEmail&&(o="self-message"),t.append($("<span>",{html:e.message})),t.append($("<br>")),t.append($("<small>",{html:e.user_email})),t.addClass(o),$("#message-list").append(t)})}}let add_click_action_to_like_button=function(){for(var e of $(".like-buttons")){let o=$(e);o.click(function(e){e.preventDefault(),$.ajax({type:"GET",url:o.attr("href")}).done(function(e){let t=o.attr("data-likes");console.log(t),t=e.data.deleted?parseInt(t)-1:parseInt(t)+1,o.attr("data-likes",t),o.find("span").html(t)}).fail(function(e){e&&console.log("error in completing the ajax request")})})}};function noty_flash(e,t){new Noty({theme:"metroui",text:t,type:e,layout:"topRight",timeout:1e3}).show()}add_click_action_to_like_button(),$("#friends-container .badge").click(function(e){e.preventDefault(),$("#user-chatbox").toggleClass("d-none")});let create_post=()=>{let t=$("#new-post-form");t.submit(e=>{e.preventDefault(),$.ajax({type:"POST",url:"/posts/create",data:t.serialize(),success:e=>{var t=new_post_dom(e.data);$("#posts-container").prepend(t),comment_creator($(`#post_${e.data.post_id} .new-comment-form`)),add_like_button_functionality($("#like-"+e.data.post_id)),noty_flash("success","Post created Successfully!"),$("textarea")[0].value="",deletePost($(" .delete-post-button",t))},error:e=>{console.log(e.responseText)}})})},new_post_dom=e=>$(`<!-- for loop for comment cards -->
    <div class="card w-100 mt-3 mb-2" id="post_${e.post_id}">
        <div class="card-body">
    
            <!-- options to delete a post and stuff -->
            
            <div class="dropdown">
                <a class="float-right" href="" id="more_options_${e.post_id}" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i class="fas fa-ellipsis-h"></i>
                </a>
                <div class="dropdown-menu" aria-labelledby="more_options_${e.post_id}">
                    <a class="dropdown-item delete-post-button" href="/posts/destroy/${e.post_id}"><i
                            class="fas fa-trash-alt"></i>
                        Delete</a>
                </div>
            </div>
            

            <h5 class="card-title">${e.user_name}</h5>
            <p class="card-text">${e.post_content}</p>
            <div class="card-text mt-2"><small>${e.updatedAt.toString().substr(0,15)}</small></div>
            <hr>
            
            <a href="/likes/toggle/?id=${e.post_id}&type=Post" id="like-${e.post_id}" class="like-buttons"
            data-toggle="false" data-likes="0"><i class="far fa-heart"></i> <span>0</span></a>
            &nbsp&nbsp&nbsp

            <a data-toggle="collapse" href="#collapse_${e.post_id}" role="button" aria-expanded="false"
                aria-controls="collapse${e.post_id}"><i class="far fa-comment"></i></a>&nbsp&nbsp&nbsp
            <a href=""><i class="fas fa-paper-plane"></i></a>
        </div>
        <div class="collapse post-comments mr-2 ml-2" id="collapse_${e.post_id}">
            
            <form action="/comments/create" method="POST" class="new-comment-form">
                <input type="text" class="form-control" placeholder="Add a new Comment..." aria-label="Username"
                    aria-describedby="basic-addon1" name="content" required>
                <input type="hidden" name="post" value="${e.post_id}">
                <button type="submit" class="btn btn-primary btn-sm mt-2 mb-2 mr-2">Add Comment</button>
            </form>
            <!-- comments list container -->
            <hr>
            <div class="post-comments-lister-list pl-4 pr-4">
                <div id="post-comments-${e.post_id}">
                
                </div>
            </div>
            
        </div>
    </div>`),deletePost=t=>{$(t).click(e=>{e.preventDefault(),$.ajax({type:"GET",url:$(t).prop("href"),success:e=>{$("#post_"+e.data.post_id).remove(),noty_flash("success","Post deleted Successfully")},error:e=>{console.log(e.responseText),noty_flash("error","There was some error in deleting the post")}})})},apply_dynamic_delete_to_existing_posts=function(){for(var e of $(".delete-post-button"))deletePost(e)},comment_creator=(apply_dynamic_delete_to_existing_posts(),create_post(),function(t){t.submit(e=>{e.preventDefault(),$.ajax({type:"POST",url:"/comments/create",data:t.serialize(),success:e=>{var t=new_comment_dom(e.data);$("#post-comments-"+e.data.post_id).prepend(t),$(`#post_${e.data.post_id} .new-comment-form input`)[0].value="",noty_flash("success","Comment posted Successfully!"),add_like_button_functionality($("#like-"+e.data.comment_id)),delete_comment($(" .delete-comment-button",t))},error:e=>{noty_flash("success","Error in posting a comment!"),console.log(e.responseText)}})})}),new_comment_dom=e=>$(`<!-- for deleting a comment -->
    <div id="comment_id_${e.comment_id}">
        <div class="dropdown">
            <a class="float-right" href="" id="more_options_${e.comment_id}" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-ellipsis-h"></i>
            </a>
            <div class="dropdown-menu" aria-labelledby="more_options_${e.comment_id}">
                <a class="dropdown-item delete-comment-button" href="/comments/destroy/${e.comment_id}"><i
                        class="fas fa-trash-alt"></i>
                    Delete</a>
            </div>
        </div>
        <b>${e.user_name}</b>
        <p>
            ${e.comment_content}
        </p>

        <div class="align-middle action-buttons">
            <!-- like button on post -->
            <a href="/likes/toggle/?id=${e.comment_id}&type=Comment" id="like-${e.comment_id}" class="like-buttons"
                data-likes="0" data-toggle="false"><i class="far fa-heart"></i> <span>0</span> </a> &nbsp
            <!-- comment button on post -->
            <a data-toggle="collapse" href="#collapse${e.comment_id}" role="button" aria-expanded="false"
            aria-controls="collapse${e.comment_id}"><i class="far fa-comment"></i></a>&nbsp
            <!-- send button on post -->
            <a href=""><i class="fas fa-paper-plane"></i></a>
        </div>

        <hr>
    </div>`),delete_comment=t=>{$(t).click(e=>{e.preventDefault(),$.ajax({type:"GET",url:$(t).prop("href"),success:e=>{$("#comment_id_"+e.data.comment_id).remove(),noty_flash("success","Comment deleted Successfully")},error:e=>{console.log(e.responseText),noty_flash("error","There was some error in deleting the post!")}})})},apply_dynamic_comment_delete_to_existing_comments=e=>{delete_comment(e)};for(let e of $(".delete-comment-button"))apply_dynamic_comment_delete_to_existing_comments(e);for(let e of $(".new-comment-form"))comment_creator($(e));let add_like_button_functionality=o=>{o.click(function(e){e.preventDefault(),$.ajax({type:"GET",url:o.attr("href")}).done(function(e){let t=o.attr("data-likes");console.log(t),t=e.data.deleted?parseInt(t)-1:parseInt(t)+1,o.attr("data-likes",t),o.find("span").html(t)}).fail(function(e){e&&console.log("error in completing the ajax request")})})};