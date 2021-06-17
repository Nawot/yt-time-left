var admZip = require('adm-zip')


let path = 
{
    build: 'dist/',
    src: 'src/'
}
let zip = new admZip()
zip.addLocalFolder(path.src)
zip.writeZip(path.build + 'yt-time-left.zip');

