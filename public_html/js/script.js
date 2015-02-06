var draw_genes_iter = 1;
function Population(size) {

    this.candidates = [];
    this.bestGenes = [];
    this.p_size = size;
    this.fit_prev=0.0;
    for (var i = 0; i < this.p_size; i++) {
        this.candidates.push(new Candidate());
    }
    
    
    this.refresh_candidates_split = function() {
        this.candidates = [];
        var rand = Math.random();
        for (var i = 0; i < this.p_size; i++) {
            if(rand<.5){
                this.candidates.push(new Candidate(this.generateRandomDNA(draw_genes_iter)));
            }else{
                //this.candidates.push(new Candidate(this.generateRandomDNA(draw_genes_iter)));
                this.candidates.push(new Candidate(this.grab_genes(this.bestGenes,draw_genes_iter)) );
            }
        }
    };

    this.refresh_candidates_same = function() {
        this.candidates = [];
        for (var i = 0; i < this.p_size; i++) {
            this.candidates.push(new Candidate(this.grab_genes(this.bestGenes, draw_genes_iter)));
        }
    };
    
    this.exoncount=draw_genes_iter;
    
    this.grab_genes = function(dna, numberToGrab) {
        var gene = [];
        var k = Math.floor(dna.length * Math.random());
        var gene_num = 0;
        if (dna.length >= 1) {
            while (numberToGrab > gene_num) {

                if ((k < dna.length) && (dna[k] === 'e')) {
                    gene.push(dna[k]);
                    k++;

                    while ((k < dna.length) && (dna[k] !== 'x') && isNumber(dna[k])) {
                        gene.push(dna[k]);
                        k++;
                    }

                    if ((k < dna.length) && (dna[k] === 'x')) {
                        gene.push(dna[k]);
                        k = Math.floor(dna.length * Math.random());
                        gene_num++;
                    } else {
                        k = Math.floor(dna.length * Math.random());
                    }

                } else {
                    k = Math.floor(dna.length * Math.random());
                }

                k = Math.floor(dna.length * Math.random());
            }
        }
        return gene;
    };

    this.genomeAnalysis = function(dna) {
        var exonCount = 0;
        var intronCount = 0;
        var stopCount = 0;
        var gene = [];
        var k = 0;
        while (k < dna.length) {
            if (dna[k] === 'e') {
                k++;
                while (dna[k] !== 'x' && isNumber(dna[k])) {
                    gene.push(dna[k]);
                    k++;
                }

                if (dna[k] === 'x') {
                    stopCount += 1;
                    if (gene.length >= numPolyPoints) {
                        exonCount += 1;
                    }
                    gene = [];
                } else {
                    gene = [];
                }
            }
            if (dna[k] === 'i') {
                k++;
                while (dna[k] !== 'x' && isNumber(dna[k])) {
                    gene.push(dna[k]);
                    k++;
                }

                if (dna[k] === 'x') {
                    stopCount += 1;
                    if (gene.length >= numPolyPoints) {
                        intronCount += 1;
                    }
                    gene = [];
                } else {
                    gene = [];
                }
            }
            k++;
        }


        return {'exonCount': exonCount, 'intronCount': intronCount, 'stopCount': stopCount};
    };

    this.nextGeneration = function() {
        if (all_same_fit && genCount > 0) {
            this.candidates = this.candidates.sort(
                    function(a, b) {
                        return b.fitness - a.fitness;
                    }
            );
            this.fit_prev=fitNow;
            var fit = this.candidates[0].dna;
            var geneBestLatest = fit.slice(fit.length - (2 + numPolyPoints)*draw_genes_iter, fit.length);
            this.exoncount+=draw_genes_iter;
            this.bestGenes = this.bestGenes.concat(geneBestLatest);
            draw(geneBestLatest, best_so_far_ctx, 1);
            this.refresh_candidates_same();
        } else {
            this.candidates = this.candidates.sort(
                    function(a, b) {
                        return b.fitness - a.fitness;
                    }
            );
            var offspring = [];
            var numCoolParents = Math.floor(this.candidates.length * parentCutoff);
            var numChildren = Math.ceil(1.0 / parentCutoff);
            if (!killParents)
                numChildren--;
            for (var i = 0; i < numCoolParents; i++) {
                //parents DNA
                var dna = this.candidates[i].dna;
                for (var j = 0; j < numChildren; j++) {
                    var rndCandidate = i;
                    while (rndCandidate === i)
                        rndCandidate = (Math.random() * numCoolParents) >> 0;
                    //parents DNA2

                    var synthObject = new Meiosis(dna, this.candidates[rndCandidate].dna);
                    offspring.push(
                            new Candidate(synthObject.chromosomes)
                            );
                }
            }

            if (killParents) {
                this.candidates = offspring;
            } else {
                this.candidates.length = numCoolParents;
                this.candidates = this.candidates.concat(offspring);
            }
            this.candidates.length = size;
        }
    };

    this.getSize = function() {
        return this.candidates.length;
    };

    this.getFittest = function() {
        return this.candidates.sort(
                function(a, b) {
                    return b.fitness - a.fitness;
                }
        )[0];
    };
    this.generate_random_DNA_sequence = function(exon_or_intron) {
        var values = [];
        if ('exon' === exon_or_intron.toLowerCase()) {
            values.push('e');
        } else {
            values.push('i');
        }

        // shape values
        for (var j = 0; j < numPolyPoints; j++) {
            values.push(Math.random());
        }
        values.push('x');
        return values;
    };

    this.generateRandomDNA = function(exons_number, introns_number) {
        var values = [];
        /*primary mutation occurs HERE */
        for (var i = 0; i < exons_number; i++) {
            values = values.concat(this.generate_random_DNA_sequence("exon"));
        }
        return values;
    };

}



// To create a variable, we use only one equals sign
// But to check if two values are equal, we use 3 equal signs.

// declare your variable here:
// To create a variable, we use only one equals sign
// But to check if two values are equal, we use 3 equal signs.

// declare your variable here:

function Meiosis(parDna1, parDna2) {
    this.chromosomes = [];

    this.getPoisson = function(lambda) {
        var L = Math.exp(-lambda);
        var p = 1.0;
        var k = 0;

        do {
            k++;
            p *= Math.random();
        } while (p > L);

        return k - 1;
    };


    this.evenQuickerMutation = function(dna) {

        var numberOfGeneralMutationsOnAverage = (mutateChance > 0.0) ? Math.ceil(((2 + numPolyPoints) * draw_genes_iter) / (1 / mutateChance)) : 1;
        var numberOfMutationsThisTime = (mutateChance > 0.0) ? this.getPoisson(numberOfGeneralMutationsOnAverage) : 1;
        var mut_back_to = ((2 + numPolyPoints) * draw_genes_iter) - 1;
        for (var i = 0; i < numberOfMutationsThisTime; i++) {
            var nucleotide = dna.length - 1 - Math.round(Math.random() * mut_back_to);
            if (!isNaN(parseFloat(dna[nucleotide]))) {
                dna[nucleotide] = Math.random();
                //guss with mean of nuc and std with change_amt
                //var number = (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
                //dna[nucleotide] = Math.max(0, Math.min(1, number * change_amt + dna[nucleotide]));
            }
        }

        return dna;
    };

    this.crossOver = function(dna1, dna2) {
        var mut_back_to = ((2 + numPolyPoints) * draw_genes_iter) - 1;
        var cross;
        var length1 = dna1.length;
        var length2 = dna2.length;

        if (length1 > length2) {
            cross = length2 - 1 - Math.round(mut_back_to / 2);
        } else {
            cross = length1 - 1 - Math.round(mut_back_to / 2);
        }
        
        if (Math.random() > .5) {
            return dna1.slice(0, cross).concat(dna2.slice(cross, length2));
        } else {
            return dna2.slice(0, cross).concat(dna1.slice(cross, length1));
        }
    };

    if (parDna1 && parDna2) {
        var cross = this.crossOver(parDna1, parDna2);
        this.chromosomes = this.evenQuickerMutation(cross);
    }


}

function Candidate(dna) {
    var values = [];

    if (dna) {
        values = dna;
    } else {
        values = this.generateRandomDNA(draw_genes_iter, 0);
    }

    this.isNumber = function(o) {
        return !isNaN(o - 0);
    };
    this.dna = values;
    this.fitness = 0;

    this.calcFitness();
}
var testWidth;
var testHeight;
var IMAGE = new Image();
var popSize;
var mutateChance;
var logField;
var color = true;
var killParents = false;
var parentCutoff;
var difSquared = true;
var best_so_far, best_so_far_ctx, display_el, display_ctx;

var $ = function(id) {
    return document.getElementById(id);
};

var real_img_data = [];

Candidate.prototype.calcFitness = function() {
    draw(this.dna, test_ctx, 1);

    var data = test_ctx.getImageData(0, 0, testWidth, testHeight).data;
    var dif = 0;
    //number of pixels
    if (difSquared) {
        var l = data.length;
        while (l--) {
            dp = data[l] - real_img_data[l];
            dif += dp * dp;
        }
    } else {
        var p = data.length;
        while (p--) {
            dif += Math.abs(data[p] - real_img_data[p]);
        }
    }

    if (difSquared) {
        this.fitness = (1 - dif / (testWidth * testHeight * 4 * 255 * 255));
    } else {
        this.fitness = (1 - dif / (testWidth * testHeight * 4 * 255));
    }
};


Candidate.prototype.generateGuassianNumber = function(mean, stdev) {
    var number = (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
    return Math.max(0, Math.round(number * stdev + mean));
};


Candidate.prototype.generate_random_DNA_sequence = function(exon_or_intron) {
    var values = [];
    if ('exon' === exon_or_intron.toLowerCase()) {
        values.push('e');
    } else {
        values.push('i');
    }

    // shape values
    for (var j = 0; j < numPolyPoints; j++) {
        values.push(Math.random());// px
    }
    values.push('x');
    return values;
};

Candidate.prototype.generateRandomDNA = function(exons_number, introns_number) {
    var values = [];
    /*primary mutation occurs HERE */
    for (var i = 0; i < exons_number; i++) {
        values = values.concat(this.generate_random_DNA_sequence("exon"));
    }

    return values;
};

function isNumber(o) {
    return !isNaN(o - 0);
}

function draw(dna, ctx, scale) {
    updateCloneCanvas(best_so_far);

    var vals = dna.slice(dna.length - (2 + numPolyPoints) * draw_genes_iter, dna.length);
    var i = 0;
    while (i < vals.length) {
        if (vals[i] === 'e') {
            i++;
            var gene = [];
            while (isNumber(vals[i])) {
                gene.push(vals[i]);
                i++;
            }

            if (vals[i] === 'x') {
                if (gene.length >= numPolyPoints) {
                    expressGene(gene, ctx, scale);
                }
                gene = [];
            } else {
                gene = [];
            }
        }
        i++;

    }
}

//create a test canvas -- where the best genes\image has new circles drawn onto it...
var test_canvas = document.createElement('canvas');
var test_ctx = test_canvas.getContext('2d');
function updateCloneCanvas(oldCanvas) {
    //set dimensions
    test_canvas.width = oldCanvas.width;
    test_canvas.height = oldCanvas.height;
    //apply the old canvas to the new one
    test_ctx.drawImage(oldCanvas, 0, 0);
}

function write_svg_from_points_and_color_arrays(arrays_points_and_color, scale, count, fit) {
// output DNA string in SVG format
    var dna_string = "";
    var dw = testWidth * scale;
    var dh = testHeight * scale;
// header
    if (count) {

    } else {
        count = "?";
    }
    dna_string += ("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
    dna_string += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"count=" + count.toString() + " fit=" + fit.toString() + "\">\n";
    dna_string += "<svg xmlns=\"http://www.w3.org/2000/svg\"\n";
    dna_string += "xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:ev=\"http://www.w3.org/2001/xml-events\"\n";
    dna_string += "version=\"1.1\" baseProfile=\"full\"\n";
    dna_string += "width=\"" + dw.toString() + "mm\" height=\"" + dh.toString() + "mm\">\n";
// shapes
    for (var i = 0; i < arrays_points_and_color.length; i += 2) {
        dna_string += "<polygon points=\"";
        dna_string += arrays_points_and_color[i].join(", ");

        dna_string += "\" fill=\"rgb(";
        dna_string += arrays_points_and_color[i + 1][0] + ",";
        dna_string += arrays_points_and_color[i + 1][1] + ",";
        dna_string += arrays_points_and_color[i + 1][2] + ")\" opacity=\"";
        dna_string += arrays_points_and_color[i + 1][3] + "\" />\n";
    }
    dna_string += "<\/svg>\n";
    return dna_string;
}
function seperateDnaIntoColorAndPointArrays(dna, scale) {
    var i = 0;
    var dw = testWidth * scale;
    var dh = testHeight * scale;
    var expressionArray = [];
    var vals = dna;
    var svgPointArray = [];
    var svgColorArray = [];


    while (i < vals.length) {
        if (vals[i] === 'e') {
            i++;
            var gene = [];
            while (isNumber(vals[i])) {
                gene.push(vals[i]);
                i++;
            }

            if (vals[i] === 'x') {

                svgPointArray = [];
                svgColorArray = [];
                if (gene.length >= numPolyPoints) {

                    svgPointArray.push(gene[4] * dw); //+ moveWidth);
                    svgPointArray.push(gene[5] * dh); //+ moveHeight);

                    for (var j = 6; j < gene.length - 1; j++) {
                        svgPointArray.push((gene[j] * dw)); //+ moveWidth);
                        svgPointArray.push((gene[1 + j] * dh)); //+ moveHeight);
                    }

                    svgColorArray.push(((gene[0] * 255) >> 0), ((gene[1] * 255) >> 0), ((gene[2] * 255) >> 0), gene[3]);

                    expressionArray.push(svgPointArray, svgColorArray);
                }
                gene = [];

            } else {
                gene = [];
            }
        }
        i++;
    }
    return expressionArray;
}

function export_dna_as_svg(scale, count, fit) {
    if (fittest) {
        var el = document.getElementById("clipboard");
        var colorAndPointArrays = seperateDnaIntoColorAndPointArrays(fittest.dna, scale);
        el.value += write_svg_from_points_and_color_arrays(colorAndPointArrays, scale, count, fit);
    }
}

function trueExport() {
    var p = (fittest.fitness * 100).toFixed(4);
    var colorAndPointArrays = seperateDnaIntoColorAndPointArrays(pop.bestGenes, 1.0);
    
    svg_temp_hold_till_export_click="";
    svg_temp_hold_till_export_click += write_svg_from_points_and_color_arrays(colorAndPointArrays, 1, genCount, p);

    dna_temp_hold_till_export_click="";
    dna_temp_hold_till_export_click += "<DNA - Count" + genCount.toString() + " - TopFit" + p.toString() + ">";
    dna_temp_hold_till_export_click += pop.bestGenes.join();
    dna_temp_hold_till_export_click += "<END>\n";

    var el = document.getElementById("clipboard");
    el.value = svg_temp_hold_till_export_click;

    var el2 = document.getElementById("genome_clip");
    el2.value = dna_temp_hold_till_export_click;

}


function exportRawDNA(count, fit) {
    var el = document.getElementById("genome_clip");
    if (el && fittest) {
        el.value += "<DNA - Count" + count.toString() + " - TopFit" + fit.toString() + ">";
        el.value += fittest.dna.join();
        el.value += "<END>\n";
    }
}

function select_all(el)
{
    var text_val = document.getElementById(el);
    text_val.focus();
    text_val.select();
}

function expressGene(gene, ctx, scale) {
    if (gene.length >= numPolyPoints) {
        var i = 0;
        var dw = testWidth * scale;
        var dh = testHeight * scale;

        ctx.beginPath();
        ctx.moveTo(
                (gene[i + 4]) * dw,
                (gene[i + 5]) * dh
                );

        for (var j = 6; j < gene.length - 1; j++) {
            ctx.lineTo(
                    (gene[i + j]) * dw,
                    (gene[i + 1 + j]) * dh
                    );
        }

        ctx.closePath();


        //if (color)
        ctx.fillStyle = "rgba(" + ((gene[i] * 255) >> 0) + "," + ((gene[i + 1] * 255) >> 0) + "," + ((gene[i + 2] * 255) >> 0) + "," + gene[i + 3] + ")";
        //else
        //ctx.fillStyle = "rgba(" + ((gene[i] * 255) >> 0) + "," + ((gene[i] * 255) >> 0) + "," + ((gene[i] * 255) >> 0) + "," + gene[i + 3] + ")";
        ctx.fill();
    }
}

function log() {
    var args = [];
    for (var i = 0; i < arguments.length; i++)
        args.push(arguments[i]);
    logField.value = args.join("\r\n");
}


window.onload = function() {
    logField = $("log");

    $("startbutton").disabled = false;
}


var same_fit_counter = 0;
var fit_array = [];
var test_up_2;
var all_same_fit = false;
var pop;

var timer;
var startTime;
var fittest;
var dna_temp_hold_till_export_click = "";
var svg_temp_hold_till_export_click = "";
var genCount;
var fitNow = 0;
var stale=0;
function start() {
    display_el.style.display = 'inline';


    if (timer) {
        clearTimeout(timer);
        timer = 0;
    }

    startTime = new Date().getTime();

    popSize = parseInt($("popsize").value, 10);
    popSize = Math.min(10000, Math.max(10, popSize));

    test_up_2 = parseInt($("up_to").value);
    test_up_2 = Math.max(1, test_up_2);

    numPolyPoints = parseInt($("polypoints").value, 10);
    numPolyPoints = Math.min(10000, Math.max(3, numPolyPoints));
    numPolyPoints = 4 + (2*numPolyPoints);
    
    draw_genes_iter = parseInt($("draw_genes_iter").value);
    draw_genes_iter = Math.max(1, draw_genes_iter);

    mutateChance = parseFloat($("mutatechance").value);
    mutateChance = Math.min(1, Math.max(0, mutateChance));

    difSquared = $("difsquared").checked;

    mixEvo = parseInt($("mixEvo").value);
    killParents = $("killparents").checked;
    parentCutoff = parseFloat($("parentcutoff").value);
    parentCutoff = Math.max(0.01, Math.min(1.0, parentCutoff));

    //Need to reference the value from other functions --> primarily the svg export
    pop = new Population(popSize);
    genCount = 0;


      function update() {
        pop.nextGeneration();
        fittest = pop.getFittest();
        var totalTime = ((new Date().getTime() - startTime) / 1000);
        if (mixEvo > 0 && (genCount % mixEvo === 0)) {
            killParents = !killParents;
        }

        if (genCount % 10 === 0 || true) {
            display_ctx.fillStyle = "white";
            display_ctx.fillRect(0, 0, testWidth, testHeight);
            draw(fittest.dna,test_ctx,1);
            display_ctx.drawImage(test_canvas, 0, 0);
            
            if (fit_array.length === 0 || all_same_fit) {
                fit_array=[];
                for (var i = 0; i < test_up_2; i++) {
                    fit_array = fit_array.concat(0.0);
                }
                all_same_fit = false;
            }

            fitNow = fittest.fitness;
            fit_array = fit_array.concat(fitNow);
            fit_array.splice(0, 1);

            for (var i = 1; i < test_up_2; i++) {
                if ( (Math.abs(fit_array[i].toFixed(6) - fit_array[i - 1].toFixed(6)) === 0.0)  ) {//&& (fitNow > pop.fit_prev)
                    same_fit_counter++;
                } else {
                    //if ((fit_array[i].toFixed(6) <= fit_array[i - 1].toFixed(6)) && (fitNow <= pop.fit_prev)) {
                      //  stale++;
                    //}
                    same_fit_counter = 0;
                    break;
                }
            }

            if (same_fit_counter === test_up_2 - 1) {
                all_same_fit = true;
                same_fit_counter = 0;
                stale=0;
            } else {
                all_same_fit = false;
                if(stale>500 && pop.bestGenes.length>1){
                    pop.refresh_candidates();
                    stale=0;
                    console.log('stale');
                }
                same_fit_counter = 0;
            }

            log(
                    "Evolving...",
                    "Genome Analysis of Fitest:" + " Exon# -->" + pop.exoncount,
                    "Breeding from top " + (parentCutoff * 100) + "% of population",
                    "Parents " + (killParents ? "killed off after breeding" : "carried over to next generation"),
                    "---",
                    "Generation: " + genCount,
                    "Best fit: " + (fitNow * 100).toFixed(4) + "%",
                    "---",
                    "Time: " + totalTime.toFixed(2),
                    "Time per generation: " + (totalTime / genCount).toFixed(2)
                    );
        }

        genCount++;
        timer = setTimeout(update, 10);
    }

    update();

}

function stop() {
    clearTimeout(timer);
}



