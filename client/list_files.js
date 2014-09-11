var cli = require("cli").enable('status');
var util = require('util');
var fs = require('fs');

'use strict';

// recursive file gatherer
function getFiles(dir,files_, fileobjs_){
    files_ = files_ || [];
    fileobjs_ = fileobjs_ || [];
    if (typeof files_ === 'undefined') files_=[];
    if (typeof fileobjs_ === 'undefined') fileobjs_=[];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
           getFiles(name,files_,fileobjs_);
        } else {
           try {
            var contents = fs.readFileSync(name).toString();
            var cobj = JSON.parse(contents); 
            }
           catch(err){ 
               cli.error( 'bad file: ' + name + err); 
               continue;
           }
            fileobjs_.push(
                    new Config(name,
                               files[i],
                               dir,
                               contents,
                               cobj
                         ));
        }
    }
    return fileobjs_;
}
function Config(AbsFileName, RelFileName, Dir, FileContents, ConfigObject){
        return {
                'AbsFileName': typeof AbsFileName === 'string' ? AbsFileName : '',
                'RelFileName': typeof RelFileName === 'string' ? RelFileName : '',
                'Dir': typeof Dir === 'string' ? Dir : '',
                'FileContents': typeof FileContents === 'string' ? FileContents : '',
                'ConfigObject': typeof ConfigObject === 'object' ? ConfigObject : {}

        };
}


function files_html_list(files){
     for(var i in files){
        cli.info(getFiles('/borg/collective'));
     }
}

var ret=[];
ret = getFiles('/borg/collective/configs/prod');
    for (var r in ret){
        cli.info(ret[r].ConfigObject.kind);
}
//console.log(util.inspect(ret));
