var ipfs = new CordovaIpfs();
var appFilesPath = cordova.file.dataDirectory.split("file://")[1] + "files/";
ipfs.init(
  {
  src: "https://dist.ipfs.io/go-ipfs/v0.4.8/go-ipfs_v0.4.8_linux-arm.tar.gz"
  , appFilesDir: appFilesPath
  , resetRepo: false
  }
  , function(res){
    alert("Result:" + JSON.stringify(res))
  }
  , function(err){
    alert("Error:" + JSON.stringify(err));
  }
);
