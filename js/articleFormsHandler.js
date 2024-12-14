export default class articleFormsHandler {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.HIDDEN_TAG = "chelsea";
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    assignFormForInsert(formId, pageNumber, totalPages) {
        const form = document.getElementById(formId);
        if (!form) {
            return;
        }

        const currentUser = this.getCurrentUser();
        if (currentUser) {
            form.author.value = currentUser.fullName;
            form.author.readOnly = true;
        }

        form.onsubmit = (evt) => {
            evt.preventDefault();
            const formData = new FormData(form);

            let tags = formData.get('tags') || "";
            tags = this.ensureHiddenTag(tags);

            const articleData = {
                author: currentUser ? currentUser.fullName : formData.get('author'),
                title: formData.get('title'),
                content: formData.get('content'),
                tags: tags,
                imageLink: formData.get('imageLink')
            };

            this.insertArticle(articleData, pageNumber, totalPages);
        }
    }

    assignFormAndArticle(formId, hiddenFieldId, articleId, pageNumber, totalPages) {
        const form = document.getElementById(formId);
        if (!form) {
            return;
        }

        const currentUser = this.getCurrentUser();
        if (currentUser) {
            form.author.value = currentUser.fullName;
            form.author.readOnly = true;
        }

        form.onsubmit = (evt) => {
            evt.preventDefault();
            const formData = new FormData(form);

            let tags = formData.get('tags') || "";
            tags = this.ensureHiddenTag(tags);

            const articleData = {
                author: currentUser ? currentUser.fullName : formData.get('author'),
                title: formData.get('title'),
                content: formData.get('content'),
                tags: tags,
                imageLink: formData.get('imageLink')
            };

            this.updateArticle(articleId, articleData, pageNumber, totalPages);
        };
    }

    ensureHiddenTag(tagsString) {
        const tagsArray = tagsString
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        if (!tagsArray.includes(this.HIDDEN_TAG)) {
            tagsArray.push(this.HIDDEN_TAG);
        }
        return tagsArray;
    }

    insertArticle(articleData, pageNumber, totalPages) {
        const url = `${this.baseURL}/article`;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = () => {
            if (xhr.status === 201 || xhr.status === 200 || xhr.status === 204) {
                alert("You have successfully added a new article!");
                const response = JSON.parse(xhr.responseText);
                const newArticleId = response.id;
                window.location.hash = `#article/${newArticleId}/${pageNumber}/${totalPages}`;
            } else {
                alert("Error adding article: " + (xhr.responseText || `HTTP Error: ${xhr.status}`));
            }
        };
        xhr.onerror = () => {
            alert("Network error while adding the article.");
        };
        xhr.send(JSON.stringify(articleData));
    }

    updateArticle(articleId, articleData, pageNumber, totalPages) {
        const url = `${this.baseURL}/article/${articleId}`;

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
                alert("Article successfully updated!");
                window.location.hash = `#article/${articleId}/${pageNumber}/${totalPages}`;
            } else {
                alert("Error updating article: " + (xhr.responseText || `HTTP Error: ${xhr.status}`));
            }
        };
        xhr.onerror = () => {
            alert("Network error while updating the article.");
        };
        xhr.send(JSON.stringify(articleData));
    }
}