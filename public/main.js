function createPost(event) {
    event.preventDefault()
    let postTitle = document.querySelector("#title");
    let postText = document.querySelector("#text");

    let timestamp = new Date().toISOString();

    // baseUrl/api/v1/post
    axios.post(`/api/v1/post`, {
            title: postTitle.value,
            text: postText.value,
            timestamp: timestamp
        })
        .then(function(response) {
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Post Added',
                timer: 1000,
                showConfirmButton: false
            });
            renderPost();
        })
        .catch(function(error) {
            // handle error
            console.log(error.data);
            document.querySelector(".result").innerHTML = "error in post submission"
        })

    postTitle.value = ""
    postText.value = ""
}

function renderPost() {
    // baseUrl/api/v1/post
    axios.get(`/api/v1/posts`)
        .then(function(response) {
            let posts = response.data;
            let postContainer = document.querySelector(".result");
            postContainer.innerHTML = "";

            // Loop through the posts and create elements for each post
            posts.forEach(function(post) {
                let postElement = document.createElement("div");
                postElement.className += " post"

                let time = document.createElement("p")
                time.className += " regards center"
                time.style.fontSize = " 0.7em"
                time.textContent = moment(post.timestamp).fromNow()
                postElement.appendChild(time)

                let titleElement = document.createElement("h2");
                titleElement.textContent = post.title;
                titleElement.className += " scrollH";
                postElement.appendChild(titleElement);

                let textElement = document.createElement("p");
                textElement.className += " scroll";
                textElement.textContent = post.text;
                postElement.appendChild(textElement);
                postElement.dataset.postId = post.id;

                let row = document.createElement("div")
                row.className += " space-around"

             

                // Inside the loop that creates the post elements
                let edit = document.createElement("i");
                edit.className += " regards bi bi-pencil-fill";
                edit.addEventListener("click", function(event) {
                    event.preventDefault();
                    let postId = this.parentNode.parentNode.dataset.postId;
                    editPost(postId);
                });
                row.appendChild(edit);


                let del = document.createElement("i")
                del.className += " regards bi bi-trash-fill"
                del.addEventListener("click", function(event) {
                    event.preventDefault();
                    let postId = this.parentNode.parentNode.dataset.postId;
                    deletePost(postId);
                });
                row.appendChild(del)
                postElement.appendChild(row)

                postContainer.appendChild(postElement);
            });
        })
        .catch(function(error) {
            console.log(error.data);
        });
}

// delete post function
// delete post function

// Show toast notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast show";
  
    // Hide the toast after 3 seconds (adjust the timeout as needed)
    setTimeout(function() {
      toast.className = "toast hide";
    }, 3000);
  }
  
  // delete post function
  function deletePost(postId) {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      axios.delete(`/api/v1/post/${postId}`)
        .then(response => {
          console.log(response.data);
          showToast('Post Deleted Successfully'); // Show toast notification for post deletion
          renderPost();
        })
        .catch(error => {
          console.log(error.data);
          showToast('Failed to delete post'); // Show toast notification for deletion failure
        });
    }
  }
  
  // edit post
  function editPost(postId) {
    axios.get(`/api/v1/post/${postId}`)
      .then(response => {
        const post = response.data;
        const editedTitle = prompt('Enter new title:', post.title);
        const editedText = prompt('Enter new text:', post.text);
  
        if (editedTitle !== null && editedText !== null) {
          // Make the API call to update the post
          axios.put(`/api/v1/post/${postId}`, {
              title: editedTitle,
              text: editedText
            })
            .then(response => {
              console.log(response.data);
              showToast('Post Updated Successfully'); // Show toast notification for post update
              renderPost();
            })
            .catch(error => {
              console.log(error.data);
              showToast('Failed to update post'); // Show toast notification for update failure
            });
        }
      })
      .catch(error => {
        console.log(error.data);
        showToast('Failed to fetch post data'); // Show toast notification for fetch failure
      });
  }
  

// refresh page

document.addEventListener("DOMContentLoaded", function () {
    renderPost();
});