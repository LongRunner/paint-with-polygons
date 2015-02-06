var baseUpdateFunction = function (bestPositionOfSwarm,particle) {
  if (particle.BestPosition.length == 0) {
    particle.UpdateHistory();
  }

  var xmax = 3;
  var vmax = particle.swarm.PercentMaximumVelocityOfSearchSpace * xmax;

  for (var i = 0; i != particle.Velocity.length; ++i) {
    var c1 = particle.swarm.TendencyToOwnBest;
    //var r1 = rnd.NextDouble();
    var r1 = Math.random();
    var c2 = particle.swarm.TendencyToGlobalBest;
    //var r2 = rnd.NextDouble();
    var r2 = Math.random();

    var newV = particle.Velocity[i]
               + c1 * r1 * (particle.BestPosition[i] - particle.Position[i])
               + c2 * r2 * (bestPositionOfSwarm[i] - particle.Position[i]);

    if (newV > vmax) {
      newV = vmax;
    }
    if (newV < -vmax) {
      newV = -vmax;
    }

    particle.Velocity[i] = newV;
    particle.Position[i] += particle.Position[i];
  }
}

//inertia weight modle
var InertiaWeightUpdateFunction = function (bestPositionOfSwarm, particle) {
  if (particle.BestPosition.length == 0) {
    particle.UpdateHistory();
  }

  var xmax = 3;
  var vmax = particle.swarm.PercentMaximumVelocityOfSearchSpace * xmax;

  for (var i = 0; i != particle.Velocity.length; ++i) {
    var c1 = particle.swarm.TendencyToOwnBest;
    var r1 = Math.random();
    var c2 = particle.swarm.TendencyToGlobalBest;
    var r2 = Math.random();
    var m = particle.swarm.Momentum;

    var newV = m * particle.Velocity[i]
               + c1 * r1 * (particle.BestPosition[i] - particle.Position[i])
               + c2 * r2 * (bestPositionOfSwarm[i] - particle.Position[i]);
    if (newV > vmax) {
      newV = vmax;
    }
    if (newV < -vmax) {
      newV = -vmax;
    }

    particle.Velocity[i] = newV;
    particle.Position[i] += particle.Velocity[i];
  }
}


//convergence gene modle
var ConvergenceGeneUpdateFunction =
    function (bestPositionOfSwarm, particle) {
  if (particle.BestPosition.length == 0) {
    particle.UpdateHistory();
  }

  var xmax = 30000;
  var vmax = particle.swarm.PercentMaximumVelocityOfSearchSpace * xmax;

  for (var i = 0; i != particle.Velocity.length; ++i) {
    var c1 = particle.swarm.TendencyToOwnBest;
    //var r1 = rnd.NextDouble();
    var r1 = Math.random();
    var c2 = particle.swarm.TendencyToGlobalBest + 0.1;
    //var r2 = rnd.NextDouble();
    var r2 = Math.random();
    var g = 4.1;
    var k = 2 / (Math.abs(2 - g - Math.sqrt(g * g - 4 * g)));

    var newV = k * (particle.Velocity[i]
                    + c1 * r1 * (particle.BestPosition[i] - particle.Position[i])
                    + c2 * r1 * (bestPositionOfSwarm[i] - particle.Position[i]));
    if (newV > vmax) {
      newV = vmax;
    }
    if (newV < -vmax) {
      newV = -vmax;
    }
    particle.Velocity[i] = newV;
    particle.Position[i] += particle[i].Velocity[i];
  }
}

