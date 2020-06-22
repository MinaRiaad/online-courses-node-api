function getFilesNames(files) {
    let filesNames=[];
    files.map(({filename})=>{
        filesNames.push(filename);
    })
    return filesNames;
}

module.exports.getFilesNames=getFilesNames;