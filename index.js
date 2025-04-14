function handleClick() {
  fetch('https://storage.cloud.kargo.com/ad/campaign/rm/test/interview-ads.json').then(response => response.json()).then(data => {
    // stickyAdsContainer position depends on whether or not there is a bottom banner ads bar
    const tdAdFooter = document.querySelector('#AdThrive_Footer_1_tablet');
    const bottom = tdAdFooter ? tdAdFooter.getBoundingClientRect().height : 0;
    Object.assign(stickyAdsContainer.style, {
      'margin': '0',
      'padding': '0',
      'position': 'fixed',
      'bottom': bottom + 'px',
      'right': '0px',
      'z-idex': '1000002',
      'background-color': 'transparent',
    });
    
    data.ads.forEach(ad => {
      if (ad.type === 'sticky') {
        stickyAdsContainer.appendChild(createStickyAd(ad));
      } else if (ad.type = 'middle') {
        const middleAd = createMiddleAd(ad);
        // when inject middle ads, the best position might be different from site to site
        const currentNode = contentDivs[index];
        rootDiv.insertBefore(middleAd, currentNode);
        if (index + 5 < contentDivs.length) {
          index += 5;
        } 
      }
    });
    document.body.appendChild(stickyAdsContainer);

    // clear error message
    document.querySelector('.my-ui-message').innerHTML = '';
  }).catch(err => {
    // set error message
    document.querySelector('.my-ui-message').innerHTML = err;
  });
}

function createStickyAd(ad) {
  const stickyAd = document.createElement('div');
  // const [width, height] = ad.size.split('x');
  Object.assign(stickyAd.style, {
    'margin': '0',
    'padding': '0',
    'background-color': 'rgba(255,255,255,0.5)',
    'box-sizing': 'border-box',
    'border': '3px solid red',
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'start',
  });

  // add a close button
  const closeButton = document.createElement('div');
  closeButton.innerHTML = 'Close';
  closeButton.onclick = function () {
    stickyAdsContainer.removeChild(stickyAd);
  }
  Object.assign(closeButton.style, {
    'margin': '0',
    'padding': '0',
    'font-size': '8px',
  })
  stickyAd.appendChild(closeButton);

  // add ad content
  const adContent = document.createElement('div');
  adContent.innerHTML = atob(ad.markup);
  stickyAd.appendChild(adContent);

  stickyAdsContainer.appendChild(stickyAd);
  return stickyAd;
}

function createMiddleAd(ad) {
  const middleAd = document.createElement('div');
  const [width, height] = ad.size.split('x');
  Object.assign(middleAd.style, {
    'width': width,
    'height': height,
    'border': '3px solid green',
  });

  const markup = atob(ad.markup);

  // one of middle type ad is wrapped with <script type="text/adtag"> tag, browser wont run it
  // remove the wraper to make the ad render correctly
  if (markup.startsWith('<script')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = markup;
    const outer = wrapper.firstElementChild;
    middleAd.innerHTML = outer.innerHTML;
  } else {
    middleAd.innerHTML = markup;
  }
  return middleAd;
}

// simple UI with a button and an error message
const myUI = document.createElement('div');
const button = document.createElement('button');

button.textContent = 'Inject Ads';
button.onclick = handleClick;
myUI.appendChild(button);

const message = document.createElement('div');
message.classList.add("my-ui-message");
myUI.appendChild(message);

document.body.prepend(myUI);

const stickyAdsContainer = document.createElement('div');

// in order to inject middle ad to an appropriate position
// we want to insert somewhere in 'main article' to avoid any ad is too close to the bottom of the webpage 
const rootDiv = document.querySelector('main article');
const contentDivs = [];
for (let node of rootDiv.children) {
  if (node.tagName === 'DIV') {
    contentDivs.push(node);
  }
}
let index = 0;