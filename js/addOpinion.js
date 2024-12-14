export default function processOpnFrmData(event) {
    event.preventDefault();

    const opinionsFrmElm = document.getElementById("opnFrm");

    let name = opinionsFrmElm.elements['name'].value.trim();
    let email = opinionsFrmElm.elements['email'].value.trim();
    let url = opinionsFrmElm.elements['url'].value.trim();
    let keyword = opinionsFrmElm.elements['keywords'].value.trim();

    let role = '';
    let role_elements = opinionsFrmElm.elements['role'];

    if (role_elements) {
        for (let i = 0; i < role_elements.length; i++) {
            if (role_elements[i].checked) {
                role = role_elements[i].value;
                break;
            }
        }
    }

    let is_subscribed = opinionsFrmElm.elements['subscribe'].checked;
    let comment = opinionsFrmElm.elements['comment'].value.trim();

    const radioAndCheckBox = {
        is_subscribed: is_subscribed,
        role: role
    };

    const newOpinion = {
        name: name,
        email: email,
        url: url,
        keyword: keyword,
        radioAndCheckBox: radioAndCheckBox,
        comment: comment,
        created: new Date().toISOString()
    };

    let opinions = [];

    if (localStorage.getItem('myOpinion')) {
        try {
            opinions = JSON.parse(localStorage.getItem('myOpinion'));
        } catch (e) {
            console.error("Error parsing opinions from localStorage:", e);
            opinions = [];
        }
    }

    opinions.push(newOpinion);
    localStorage.setItem('myOpinion', JSON.stringify(opinions));
    alert("Your opinion was successfully added to local storage!");
    window.location.hash = "#opinions";
}