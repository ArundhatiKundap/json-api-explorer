
const postList = document.getElementById("postList");
const postForm = document.getElementById("postForm");
const fetchButton= document.getElementById("fetchButton");
const loadingMessage = document.getElementById('loadingMessage');
const filterInput = document.getElementById("filterInput");

let allPosts = []; 

loadingMessage.style.display = 'none'; //hide loading screen

const renderPosts = (posts) => { //render data to postlist div
    postList.innerHTML="";
    posts.forEach((post) =>{
        const postElement = document.createElement("div");
        postElement.innerHTML= `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <button onclick="deletePost(${post.id})">Delete</button>
           
        <hr/>
        `;
        postList.appendChild(postElement); //add postelement divs to postlist ddv
    })
}

    postForm.addEventListener("submit", (event) => {
        event.preventDefault(); //default action should not happen

        const title = document.getElementById("titleInput").value;
        const body = document.getElementById("bodyInput").value;

        fetch("https://jsonplaceholder.typicode.com/posts", { //send post form data in a post request
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ title, body })
        })
        .then(function(response){  //get response and set it to json
            const jsonResponse = response.json();
            return jsonResponse; 
        })
        .then((newPost) => {
            alert("Post submitted!");
            renderPosts([newPost]); //re-render with only new post
        })
        .catch((error) => console.error("Error submitting post:",error));// catch error if fetch fails
        });

fetchButton.addEventListener("click", () => {
    loadingMessage.style.display = 'block';

    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {
            allPosts = data;

            const keyword = filterInput.value.toLowerCase();
            const filteredPosts = keyword
                ? allPosts.filter(post =>
                    post.title.toLowerCase().includes(keyword) ||
                    post.body.toLowerCase().includes(keyword)
                )
                : allPosts;

            renderPosts(filteredPosts);
        })
        .catch(error => console.error("Error fetching posts:", error))
        .finally(() => {
            loadingMessage.style.display = 'none';
        });
});

async function deletePost(postId) {
    console.log(postId)
    try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE',
        });
        allPosts = allPosts.filter(post => post.id !== postId); // Remove from local state
        renderPosts(allPosts); // Re-render
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}
       