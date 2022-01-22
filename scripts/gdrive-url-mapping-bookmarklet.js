javascript:void(
    function(){
        if (window.location.hostname !== "drive.google.com" ||
            !window.location.pathname.startsWith('/drive/folders/')) {
            alert("Not a Google Drive Folder");
            return;
        };
        let csv = Array.from(document.querySelectorAll('.jGNTYb.ACGwFc')).map((el) => [el.getAttribute('aria-label').replace(" Image", ""), el.querySelector('img.l-u-Ab-zb-Ua').src.split('/')[6].split('=')[0]].join(',')).join('\n');

        let data = [csv],
            blob = new Blob(data, {type: 'text/csv'}),
            a = document.createElement('a');

        a.download = 'drive-mapping.csv';
        a.href = window.URL.createObjectURL(blob);
        a.click();
    }()
);
