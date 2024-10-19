const birdIconSvg = "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";

const xIcon = "M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0";
const xIcon2 = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

const replaceIcon = () => {
  const style = document.createElement('style');
  style.textContent
    = 'h1[role="heading"] svg[viewBox="0 0 24 24"] path {'
    + '  display: none;'
    + '}'
    + 'h1[role="heading"] div[dir="ltr"] {'
    + '  background-image: url(' + chrome.runtime.getURL('icons/logo_blue.png') + ');'
    + '  background-size: 28px;'
    + '  background-repeat: no-repeat;'
    + '  background-position: center;'
    + '}'
    + 'div[data-testid="TopNavBar"] > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div > svg[viewBox="0 0 24 24"] path {'
    + '  display: none;'
    + '}'
    + 'div[data-testid="TopNavBar"] > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child > div:has(>svg) {'
    + '  background-image: url(' + chrome.runtime.getURL('icons/logo_blue.png') + ');'
    + '  background-size: 24px;'
    + '  background-repeat: no-repeat;'
    + '  background-position: center;'
    + '}'
  ;
  document.body.appendChild(style);
}

/**
 * Change Favicon
 * thanks for http://0rbit.cybergence.net/torimodosu.html
 */
function changeFaviconHref() {
  const linkElement = document.querySelector('link[rel="shortcut icon"]');
  if (linkElement) {
    linkElement.setAttribute('href', chrome.runtime.getURL('icons/logo_blue_32_32.png'));
  }
}

// title戻す
const replaceTitle =()=> {
  const title = document.querySelector('title');
  title && title.text.match(/\/ X/) && (document.querySelector('title').text = title.text.replace(/\/ X$/, '/ Twitter'))
}

// ポストする→ツイートする
const replacePostToTweet = mutations => {
	const tweetButtonJp = document.querySelector('a[aria-label="ポストする"]>div>span>div>div>span>span');
	if (tweetButtonJp && tweetButtonJp.innerHTML == 'ポストする') {
		tweetButtonJp.innerHTML = 'ツイート'
	}

	const tweetButtonEn = document.querySelector('a[aria-label="Post"]>div>span>div>div>span>span');
	if (tweetButtonEn && tweetButtonEn.innerHTML == 'Post') {
		tweetButtonEn.innerHTML = 'Tweet'
	}
	
	const tweetButtonInline = document.querySelectorAll('div[data-testid=tweetButtonInline]>div:first-child[dir=ltr]>span>span');
	if (tweetButtonInline[0]) {
		if (tweetButtonInline[0].innerHTML == 'ポストする') {
		  tweetButtonInline[0].innerHTML = 'ツイート';
		} else if (tweetButtonInline[0].innerHTML == 'Post') {
			tweetButtonInline[0].innerHTML = 'Tweet';
		}
	}
	
	const dialogTweetButton = document.querySelector('div[data-testid="tweetButton"]>div>span>span');
	if (dialogTweetButton) {
		if (dialogTweetButton.innerHTML == 'ポストする') {
		  dialogTweetButton.innerHTML = 'ツイート';
		} else if (dialogTweetButton.innerHTML == 'Post') {
		  dialogTweetButton.innerHTML = 'Tweet';
		}
	}
	if (dialogTweetButton && dialogTweetButton.innerHTML == 'すべてポスト') {
		dialogTweetButton.innerHTML = 'すべてツイート';
	}
	
	// tweet's repost count label
	const tweetRepostCountLabel = document.querySelectorAll('div[role=group]>div:nth-child(2)>a[dir=ltr][role=link]>span>span');
	if (tweetRepostCountLabel && tweetRepostCountLabel[0]) {
		if (tweetRepostCountLabel[0].innerHTML == 'Repost') {
			tweetRepostCountLabel[0].innerHTML = 'Retweet';
		} else if (tweetRepostCountLabel[0].innerHTML == 'Reposts') {
			tweetRepostCountLabel[0].innerHTML = 'Retweets';
		} else if (tweetRepostCountLabel[0].innerHTML == 'リポスト') {
			tweetRepostCountLabel[0].innerHTML = 'リツイート';
		}
	}
	
	const socialContextRepostLabels = document.querySelectorAll('span[data-testid="socialContext"]');
	if (socialContextRepostLabels) {
		socialContextRepostLabels.forEach(label => {
		  if (label.innerText.endsWith('がリポストしました')) {
				label.innerHTML = label.innerHTML.replace('がリポストしました', 'がリツイートしました');
			} else if (label.innerText.endsWith('reposted')) {
				label.innerHTML = label.innerHTML.replace('reposted', 'retweeted');
			}
		});
	}
	
	const publicDraftEditorPlaceholderInner = document.querySelectorAll('div.public-DraftEditorPlaceholder-inner');
	if (publicDraftEditorPlaceholderInner.length > 0) {
		if (publicDraftEditorPlaceholderInner[0].innerText == '返信をポスト') {
			publicDraftEditorPlaceholderInner[0].innerText = '返信をツイート';
		} else if (publicDraftEditorPlaceholderInner[0].innerText == 'Post your reply!') {
			publicDraftEditorPlaceholderInner[0].innerText = 'Tweet your reply!';
		}
	}
	
	const scrollSnapListTab = document.querySelectorAll('div[data-testid="ScrollSnap-List"]>div:first-child>a:first-child>div:first-child>div:first-child>span:first-child');
	if (scrollSnapListTab.length > 0) {
		if (scrollSnapListTab[0].innerText == 'ポスト') {
			scrollSnapListTab[0].innerText = 'ツイート';
		} else if (scrollSnapListTab[0].innerText == 'Posts') {
			scrollSnapListTab[0].innerText = 'Tweets';
		}
	}
	
	// 件のポストを表示 → 件のツイートを表示
	const hoge = document.querySelectorAll('div[data-testid=cellInnerDiv]>div>div>div>div>span');
  if (hoge.length > 0 && hoge[0].innerText.endsWith('件のポストを表示')) {
		hoge[0].innerHTML = hoge[0].innerHTML.replace('件のポストを表示', '件のツイートを表示');
	}
	
	// あなたのポストをいいねしました
	const whoFavYourPost = document.querySelectorAll('article[role=article]>div:first-child>div:nth-child(2)>div:nth-child(2)>span>span');
	if (whoFavYourPost.length > 0) {
		whoFavYourPost.forEach(label => {
		  if (label.innerText.endsWith('あなたのポストをいいねしました')) {
				label.innerText = label.innerHTML.replace('あなたのポストをいいねしました', 'あなたのツイートをいいねしました');
			}
		});
	}
	
	// 件のポスト
	const mainPostCount = document.querySelector('main[role=main]>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:first-child>div:nth-child(2)>div:first-child>div:nth-child(2)');
	if (mainPostCount && mainPostCount.innerText.endsWith('件のポスト')) {
		mainPostCount.innerText = mainPostCount.innerText.replace('件のポスト', '件のツイート');
	}
}

window.addEventListener('DOMContentLoaded', ()=>{
  replaceIcon();
  changeFaviconHref();

  // title戻す
  new MutationObserver(replaceTitle).observe(document.head, {
    childList: true
  });

  // ポストする→ツイートする
  new MutationObserver(replacePostToTweet).observe(document.body, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
  });
  
});