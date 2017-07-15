

let url = 'https://api.myjson.com/bins/152f9j';
// let url = 'database.json';


function sendAjax(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            resolve(xhr.response);
        });
        xhr.addEventListener('error', () => {
            reject();
        });
        xhr.send();
    });
}

function rendersPosts(posts) {

    let letPosts = searchInput(posts);
    let postList = document.querySelector('.post-list');
    let ul = document.createElement('ul');
    let container = document.querySelector('.flex-container');
    if (postList.firstElementChild) {
        container.removeChild(postList);
        container.appendChild(ul);
        ul.className = 'post-list';
    }
    for (let i = 0; i < letPosts.length; i++) {
        let post = new Post(letPosts[i]);
        document.getElementsByClassName('post-list')[0].appendChild(post);
    }
}

function activeTagFilter(event) {
    let eventTarget = event.target;
    if (eventTarget.classList.contains('active')) {
        eventTarget.classList.remove('active');
    } else {
        eventTarget.classList.add('active');
    }
}

function checkLocalStorage() {
    if(!localStorage.getItem('arrTags')) {
        return false;
    } else {
        return localStorage.getItem('arrTags').split(',');
    }
}
function filterByTags(obj) {

    let tagListArr = document.querySelectorAll('.tags-list .active');

    let activeTags = [];
    for(let i = 0; i<tagListArr.length; i++){
        activeTags.push(tagListArr[i].innerHTML);
    }

    if (!tagListArr.length) {
        activeTags = checkLocalStorage();
        if (!activeTags) {
            return obj;
        }
    }
    if (tagListArr.length){
        localStorage.setItem('arrTags', activeTags);
    }


    let filterData = [];
    strt: for (let key in obj) {
        for (let i = 0; i < obj[key].tags.length; i++) {
            for (let e = 0; e < activeTags.length; e++) {
                if (activeTags[e] === obj[key].tags[i]) {
                    filterData.push(obj[key]);
                    continue strt;
                }
            }
        }
    }

    return filterData;
}

window.addEventListener("load", () => {
    sendAjax(url).then((response) => {
        let posts = response.data;
        dateSort(posts);
        return posts;
    }).then(posts => {
        let filteredPosts = filterByTags(posts);
        rendersPosts(filteredPosts);

        let input = document.querySelector('.search-input');
        let tagList = document.querySelector('ul.tags-list');
        let deleteButton = document.querySelector('.content-container');

        input.addEventListener('input', () => {
            let sortedData = searchInput(posts);
            rendersPosts(sortedData);
        });
        deleteButton.addEventListener('click', (event) => {
            if (event.target.classList.contains('post-delete-btn')) {
                event.target.parentNode.remove();
            }
        });
        tagList.addEventListener('click', (event) => {
            activeTagFilter(event);
            let filteredPosts = filterByTags(posts);
            rendersPosts(filteredPosts);
        });
    });

});

function dateSort(array) {
    return array.sort(function (a, b) {
        let x = a.createdAt, y = b.createdAt;
        if (x < y) return 1;
        if (x > y) return -1;
        else return 0;
    });
}
function Post(obj) {
    let btn = document.createElement('div'),
        post = document.createElement('li'),
        date = document.createElement('span'),
        title = document.createElement('p'),
        pelem = document.createElement('p'),
        span = document.createElement('span'),
        img = document.createElement('img');

    let postTitle = document.createElement('div'),
    postTags = document.createElement('div'),
    postPicture = document.createElement('div'),
    postDescription = document.createElement('div'),
    postDate = document.createElement('div');

    title.innerHTML = obj['title'];
    img.src = obj['image'];
    pelem.innerHTML = obj['description'];
    date.innerHTML = (new Date(Date.parse(obj.createdAt))).toLocaleString().split(',  ');


    if (obj.tags.length) {
        for (let i = 0; i < obj.tags.length; i++) {
            let span = document.createElement('span');
            span.innerHTML = obj.tags[i];
            postTags.appendChild(span);
        }
    }
    postTitle.className = 'post-title';
    postTags.className = 'post-tags';
    postDescription.className = 'post-text';
    postDate.className = 'post-date';
    postPicture.className = 'post-img';
    btn.className = 'post-delete-btn';


    postDate.appendChild(date);
    postTitle.appendChild(title);
    postPicture.appendChild(img);
    postDescription.appendChild(pelem);

    post.appendChild(postTitle);
    post.appendChild(postTags);
    post.appendChild(postPicture);
    post.appendChild(postDescription);
    post.appendChild(postDate);
    post.appendChild(btn);
    post.className = 'post-item';
    return post;
}

function searchInput(obj) {
    let input = document.querySelector('.search-input');
    let string = input.value;
    if (string === '') {
        return obj;
    }
    let arrString = string.split(' ');
    return obj.filter(post => arrString.every(str => post.title.includes(str)));

}
