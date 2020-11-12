var Needs = (function () {
  var controls = document.getElementById('controls');
  var levels = [];


  function draw() {
    var markup = ''
    var level;
    var need;

    markup = new Date();
    for (var i = 0; i < levels.length; i++) {
      level = levels[i];
      markup += '<h2>' + levels[i].name + '</h2>';
      for (var j = 0; j < levels[i].needs.length; j++) {
        need = level.needs[j];
        markup += '<div style="margin-bottom: 15px; background-color: #' + (satisfied(need) ? 'aaffaa' : 'ffaaaa') + ';">';
        markup += '<div style="font-weight: bold;">' + need.name + ' - ' + (satisfied(need) ? 'true' : 'false') + '</div>';
        markup += '<button onclick="Needs.Act(' + i + ',' + j + ');">' + need.action + '</button>';
        markup += '<button onclick="Needs.ResetNeed(' + i + ',' + j + ');">Reset</button>';
        markup += '<div>Last: ' + need.lastTimestamp + '</div>';
        markup += '<div>Avg: ' + (need.history.reduce((p, c) => p + c, 0) / need.history.length) + '</div>';
        markup += '</div>';
      }
    }

    controls.innerHTML = markup;
  }

  function satisfied(need) {
    return (((new Date() - need.lastTimestamp) < (need.history.reduce((p, c) => p + c, 0) / need.history.length)) || need.history.length == 0);
  }

  function need(name, action) {
    return {
      name: name,
      action: action,
      lastTimestamp: null,
      history: []
    };
  }

  function save() {
    localStorage.setItem('needs', JSON.stringify(levels));
  }

  function load() {
    var loadedNeeds = localStorage.getItem('needs');
    reset();
    if (loadedNeeds) {
      levels = JSON.parse(loadedNeeds);
      for (var l = 0; l < levels.length; l++) {
        for (var n = 0; n < levels[l].needs.length; n++) {
          if (levels[l].needs[n].lastTimestamp) {
            levels[l].needs[n].lastTimestamp = new Date(levels[l].needs[n].lastTimestamp);
          } else {
            levels[l].needs[n].lastTimestamp = null;
          }
        }
      }
      save();
    }

    tick();
  }

  function tick() {
    draw();
    setTimeout(tick, 1000);
  }

  function resetNeed(levelIndex, needIndex) {

    var Need = levels[levelIndex].needs[needIndex];

    levels[levelIndex].needs[needIndex] = need(Need.name, Need.action);
    save();
    draw();
  }

  function reset() {
    levels = [
      {
        name: 'physiological',
        needs: [
          need('food', 'eat'),
          need('air', 'breath'),
          need('water', 'drink'),
          need('warmth', 'warm')
        ]
      },
      {
        name: 'safety',
        needs: [
          need('security', 'protect'),
          need('work', 'work'),
          need('resources', 'acquire'),
          need('health', 'healthy'),
          need('property', 'acquire')
        ]
      },
      {
        name: 'belonging',
        needs: [
          need('friendship', 'hang out'),
          need('intimacy', 'be intimate'),
          need('family', 'family'),
          need('connection', 'connect')
        ]
      },
      {
        name: 'esteem',
        needs: [
          need('respect', 'earn'),
          need('self-esteem', 'build'),
          need('status', 'build'),
          need('recognition', 'be recognized'),
          need('strength', 'build'),
          need('freedom', 'be free')
        ]
      },
      {
        name: 'self-actualization',
        needs: [
          need('self-actualize', 'invest')
        ]
      }
    ];

    save();
    draw();
  }

  load();

  return {
    Act: function (level, need) {
      var now = new Date();
      var need = levels[level].needs[need];

      if (need.lastTimestamp != null) {
        need.history.push(now - need.lastTimestamp);
      }
      need.lastTimestamp = now;

      draw();
      save();
    },
    Reset: reset,
    ResetNeed: resetNeed
  };
}());
