var admZip = require('adm-zip')

let ignore_prefix = '#'
let path = 
{
    build: 'dist/',
    src: 'src/'
}
let zip = new admZip()
zip.addLocalFolder(path.src, null,
    function(filepath)
    {
        let fp = filepath.split(/[/|\\]+/) // split by / or \
        for(dir of fp)
            if(dir[0] == ignore_prefix) {return false}
        return true
    })
zip.writeZip(path.build + 'yt-time-left.zip');

