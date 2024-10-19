(function () {
  "##REPLACE_URL##" 
  var didFind = false;
  var targetUrl = document.URL;
  for(var index in possibleURLS){
    if(targetUrl.indexOf(possibleURLS[index]) === 0){
      didFind = true;
      break;
    }
  }
  return didFind;
});
