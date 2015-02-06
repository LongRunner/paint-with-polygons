var CalculateFunction = function (position) {
  var result = 0.0;

  for (var i = 0; i != position.length; ++i) {
    result += (position[i]) * (position[i]);
  }

  return result;
}

var StepFunction = function (position) {
  var result = 0.0;

  for (var i = 0; i != position.length; i++) {
    result += Math.abs(position[i]);
  }
  return result;
}

var HoleFunction = function(position) {
  var result = 1.0;

  for (var i = 0; i != position.length; i++) {
    var temp = 0.0;
    var z = 0.0;
    temp = (position[i] + 3) / 6;
    temp = temp - 5;
    z = Math.cos(temp);
    z *= z * z;
    result *= z;
  }
  return 1 - result;
}

var BumpsFunction = function (position) {
  var result = 0.0;
  for (var i = 0; i != position.length; i++) {
    var temp = (position[i] + 3) / 6;
    temp = 10 * temp - 5;

    var z = Math.cos(temp);
    result += z;
	}
  return Math.sqrt(Math.abs(result));
}





