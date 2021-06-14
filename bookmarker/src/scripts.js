class Bookmarker {
    constructor() {
        this.apiUrl = "https://opengraph.io/api/1.1/site";
        this.appId = "API_KEY HERE";
        this.$addButton = document.getElementById("addBtn");

        if (!localStorage["TASKS"]) {
            this.bookmarks = [
                {
                    title: "Github",
                    image: "https://github.githubassets.com/images/modules/site/social-cards/github-social.png",
                    link: "https://www.github.com/",
                    description: "Really cool site for open source code"
                },
                {
                    title: "DEV Community",
                    image: "https://thepracticaldev.s3.amazonaws.com/i/6hqmcjaxbgbon8ydw93z.png",
                    link: "https://dev.to/",
                    description: "great site for learning web dev"
                }
            ];
        }
        else {
            this.bookmarks = JSON.parse(localStorage["TASKS"]);
        }
        this.loadBookmarks();

        this.$addButton.addEventListener("click", event => {
            event.preventDefault();
            this.addBookmarkClick();
        })

    }

    addBookmarkClick() {
        const urlForHref = document.getElementById("url").value;
        const url = encodeURIComponent(urlForHref);
        const description = document.getElementById("description").value;
        if (url == "") {
            document.getElementById("url").parentElement.classList.add("has-error")
        }
        else if (description == "") {
            document.getElementById("description").parentElement.classList.add("has-error");
        }
        else {
            document.getElementById("url").parentElement.classList.remove("has-error");
            document.getElementById("description").parentElement.classList.remove("has-error");

            fetch(`${this.apiUrl}/${url}?app_id=${this.appId}`)
                .then(response => response.json())
                .then(data => {
                    const bookmark = {
                        title: data.hybridGraph.title,
                        image: data.hybridGraph.image,
                        link: urlForHref,
                        description: description
                    };
                    //add the data from api to the bookmark
                    this.bookmarks.push(bookmark);
                    this.loadBookmarks();
                    document.getElementById("url").value = "";
                    document.getElementById("description").value = "";
                })
                .catch(error => {
                    console.log("there was a problem getting info!");
                })
                ;
        }
    }


    loadBookmarks() {
        localStorage["TASKS"] = JSON.stringify(this.bookmarks);
        let bookmarksHtml = this.bookmarks.reduce(
            (html, bookmark, index) => html += this.generateHtmlBookmark(bookmark, index),
            "");
        document.getElementById("bookmarks-list").innerHTML = bookmarksHtml;
    }

    generateHtmlBookmark(bookmark, index) {
        return `<div class="d-flex flex-column">
        <div class="container-top">
            <img class="col-3 nopadding" src="${bookmark.image}" alt="bookmark image">
            <a class="fw-bold col-7 pt-3 bkm-text mt-3" href="${bookmark.link}">${bookmark.title}
            </a>
            <a class="text-decoration-none container-icon" href="#" onclick="bookmarker.deleteBookmark(event, ${index})">
                <i class="col-2 fa fa-trash-o fa-lg"></i>
            </a>
        </div>
        <div class="container-bottom rounded-bottom bkm-text">
            <p>${bookmark.description}</p>
        </div>
    </div><hr>`
            ;
    }

    deleteBookmark(event, index) {
        //icon clicked is in a <a> tag. prevent browser's defaut behavior: to go to href="#" which would refresh the page. 
        event.preventDefault();
        this.bookmarks.splice(index, 1);
        this.loadBookmarks();
    }
}

let bookmarker;
window.onload = () => { bookmarker = new Bookmarker(); }
