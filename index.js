var Docker = require('dockerode');
var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

function gc () {
  var time = ~~((Date.now() - 1000 * 60 * 10)/1000);
  docker.listContainers({
    all: true
  }, function (err, containers) {
    if (err) {
      console.error(err);
    } else {
      containers.forEach(function (container) {
         if (container.Created < time) {
           console.log('removing', container.Id);
           docker.getContainer(container.Id).remove({
             force: true
           }, function (err) {
             console.log('removed', container.Id);
             if (err) {
               console.log(err);
             }
           });
         } else {
           console.log(container.Created, time);
         }
      });
    }
  });
}

gc();

setInterval(gc, 1000 * 60);
