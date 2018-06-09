$(function() {
  var onTuple = $("#main").data("ontuple");
  var offTuple = $("#main").data("offtuple");
  var subscriber = $("#main").data("init");

  console.log(JSON.stringify(subscriber));

  let linda = new mqttLindaClient();

  let clid = "server-watch" + Date.now().toString();

  let settings = {
    host: "localhost",
    port: 3000,
    clientId: clid,
    tupleSpace: "masuilab"
  };

  console.log(onTuple);

  linda.connect(settings).then(() => {
    init();
    linda.on("connect", () => {
      linda.watch(onTuple, (topic, data) => {
        console.log("get data :" + JSON.stringify(data));
        onsub(data.name);
      });

      linda.watch(offTuple, (topic, data) => {
        console.log("get data :" + JSON.stringify(data));
        //$('<li>' + JSON.stringify(data.name) + ' of' +'</li>').prependTo('#content').hide().fadeIn(500);
        offsub(data.name);
      });
    });
  });

  let onsub = n => {
    if (!subscriber[n]) {
      subscriber[n] = Date.now();
      $(
        '<div id="' +
          n +
          '">' +
          n +
          "    (watcing topic is : " +
          subscriber[n].topic +
          ")" +
          "</div>"
      )
        .prependTo("#content")
        .hide()
        .fadeIn(500);
    } else {
      let domid = "#" + n;
      $(domid).fadeIn(500);
    }
  };

  let offsub = n => {
    if (!subscriber[n]) {
      subscriber[n] = Date.now();
      $(
        '<div id="' +
          n +
          '">' +
          n +
          "    (watcing topic is : " +
          subscriber[n].topic +
          ")" +
          "</div>"
      )
        .prependTo("#content")
        .hide();
    } else {
      let domid = "#" + n;
      $(domid).hide(500);
    }
  };

  let init = () => {
    for (let n in subscriber) {
      $(
        '<div id="' +
          n +
          '">' +
          n +
          "    (watcing topic is : " +
          subscriber[n].topic +
          ")" +
          "</div>"
      )
        .prependTo("#content")
        .hide()
        .fadeIn(500);
    }
  };
});
