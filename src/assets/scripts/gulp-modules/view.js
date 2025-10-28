if (document.getElementById('loadIframeButton')) {
  document.getElementById('loadIframeButton').addEventListener('click', function() {
    var iframe = document.getElementById('lazyIframe');
    iframe.src = iframe.getAttribute('data-src');
    iframe.style.display = 'block';

    this.style.display = 'none';
    document.querySelector('.iframe-container').classList.add('active-iframe');
  });
}
