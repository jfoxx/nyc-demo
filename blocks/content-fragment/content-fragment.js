import { toClassName} from '../../scripts/aem.js';

// put your AEM publish address here
const aem_publish = "https://publish-p49252-e308251.adobeaemcloud.com";
const AEM_HOST = checkDomain()
const cacheBuster = Math.random() * (5000 - 1) + 5000;

function checkDomain(){
  if (window.location.hostname.includes("hlx.page") || window.location.hostname.includes("hlx.live") || window.location.hostname.includes("localhost")){
    return aem_publish    
  }else{
    return window.location.origin 
  }
}

export default function decorate(block) {
    const slug = block.querySelector('div:first-of-type>p').textContent.trim();
    const variation = toClassName(block.querySelector('div:last-of-type>p').textContent.trim());

    fetch(`${AEM_HOST}/graphql/execute.json/nyc-demo/getEvent;variation=${variation}?${cacheBuster}`)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        const wrapper = document.createElement('div');
        const imgDiv = document.createElement('div');
        const image = document.createElement('img');
        image.src = aem_publish + response.data.eventList.items[0].promoImage._dynamicUrl;
        imgDiv.append(image);
        const txtDiv = document.createElement('div');
        const txtTitle = document.createElement('strong');
        txtTitle.innerText = response.data.eventList.items[0].title;
        const titleP = document.createElement('p');
        titleP.append(txtTitle);
        const txtP = document.createElement('p');
        txtP.innerText = response.data.eventList.items[0].promo.plaintext;
        txtDiv.append(titleP, txtP);
        block.textContent = '';
        wrapper.append(imgDiv, txtDiv);
        block.append(wrapper);
    })
    .catch(error => {
    console.log('Error fetching data:', error);
    });

}




