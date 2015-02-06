var Particle = function (position_, velocity_, swarm_) {
  this.bestCost = 1.0e100;
  this.cost  = 0;
  //this.rnd = new Random();

  this.swarm = new ParticleSwarm();
  swarm = swarm_;

  //These two array can replaced by ParallelArray;
  this.Position = position_;
  this.Velocity = velocity_;

  //The best location of this particle in history
  this.BestPosition = new Array();
}

Particle.prototype.ParticleInit = function () {
  this.bestCost = 1.0e10;
}

Particle.prototype.CalculateCost = function() {
  this.cost = CalculateFunction(this.Position);
}

Particle.prototype.UpdateHistory = function () {
  if (this.cost < this.bestCost) {
    this.bestCost = this.cost;
    this.BestPosition = this.Position;
  }
}
var ParticleSwarm = function () {
  this.Particles = new Array();

  //inertia coefficient
  this.Momentum = 1.05;

  //cognitive coefficient
  this.TendencyToOwnBest = 2;


  //social coefficient
  this.TendencyToGlobalBest = 2;

  //K value
  this.PercentMaximumVelocityOfSearchSpace = 0.1;

  //Whether or not a global optimization strategy,
  //default is true;
  this.UseGlobalOptimum = true;

  this.BestPositionOfSwarm = new Array();

  this.BestCostOfSwarm = 1.0e100;
}

ParticleSwarm.prototype.InitSwarm = function (swarmSize, dimension) {
  var particles_ = new Array();

  for (var i = 0; i != swarmSize; ++i) {
    var position_ = new Array();
    var velocity_ = new Array();

    for (var j = 0; j != dimension; j++) {
      var x = Math.random() * 6 - 3;
      var vx = Math.random() * 6 - 3;
      position_.push(x);
      velocity_.push(vx);
    }

    var particle_ = new Particle(position_, velocity_, ParticleSwarm);
    particles_.push(particle_);
  }
  this.Particles = particles_;
}


ParticleSwarm.prototype.SwarmSize = function () {
  return this.Particles.length;
}

ParticleSwarm.prototype.CurrentBestPosition = function () {
  return this.Particles[0].Position;
}

ParticleSwarm.prototype.CurrentBestCost = function () {
  return this.Particles[0].cost;
}

ParticleSwarm.prototype.compareTo = function(p1, p2) {
  if (p1.cost < p2.cost)
    return -1;
  if (p1.cost == p2.cost)
    return 0;
  if (p1.cost > p2.cost)
    return 1;
}

ParticleSwarm.prototype.SortParticles = function () {
  this.Particles.sort(compareTo);
}

ParticleSwarm.prototype.Iteration = function (updateFunction) {
  for (var i = 0; i != this.Particles.length; ++i) {
    this.Particles[i].CalculateCost();
    this.Particles[i].UpdateHistory();
  }

  this.Particles.sort(this.compareTo);

  if (this.CurrentBestCost() < this.BestCostOfSwarm) {
    this.BestPositionOfSwarm = this.CurrentBestPosition();
    this.BestCostOfSwarm = this.CurrentBestCost();
  }

  var bestSwarmPosition = this.BestPositionOfSwarm;
  for (var i = 0; i != this.Particles.length; ++i) {
    if (this.UseGlobalOptimum) {
      //this.Particles[i].UpdateVelocityAndPosition(this.BestPosition);
      updateFunction(bestSwarmPosition,  this.Particles[i]);
    } else {
      //this.Particles[i].UpdateVelocityAndPosition(this.CurrentBestPosition());
      updateFunction(this.CurrentBestPosition(), this.Particles[i]);
    }
    console.log(bestSwarmPosition);
  }
}
