<script>
	import { Scatter } from "../Scatter";

    const scatterData = [
  {
    Height: 5.378134684276249,
    Diameter: 0.2837053102864515,
    Family: "apple",
  },
  {
    Height: 7.026770998894443,
    Diameter: 0.33207590604763576,
    Family: "apple",
  },
  {
    Height: 8.315904765022157,
    Diameter: 0.43373473004096097,
    Family: "apple",
  },
  {
    Height: 3.6498932725961946,
    Diameter: 0.340192927284109,
    Family: "apple",
  },
  {
    Height: 6.5075162679197005,
    Diameter: 0.4208133542045584,
    Family: "apple",
  },
  {
    Height: 8.348660609314411,
    Diameter: 0.2899813396901569,
    Family: "apple",
  },
  {
    Height: 9.421950227722382,
    Diameter: 0.20528286046244248,
    Family: "apple",
  },
  {
    Height: 7.896332074805976,
    Diameter: 0.2760452936212325,
    Family: "apple",
  },
  {
    Height: 8.991058052538946,
    Diameter: 0.323141279464649,
    Family: "apple",
  },
  {
    Height: 8.779807373618395,
    Diameter: 0.2794179616731622,
    Family: "apple",
  },
  {
    Height: 6.224027369482324,
    Diameter: 0.3377198782721952,
    Family: "apple",
  },
  {
    Height: 7.786999135105338,
    Diameter: 0.4162146742257026,
    Family: "apple",
  },
  {
    Height: 8.577082057259027,
    Diameter: 0.3920555558040337,
    Family: "apple",
  },
  {
    Height: 7.5783578760247075,
    Diameter: 0.3329767205122587,
    Family: "apple",
  },
  {
    Height: 5.401945172658548,
    Diameter: 0.3925712658993029,
    Family: "apple",
  },
  {
    Height: 6.424278009108987,
    Diameter: 0.3750560316196041,
    Family: "apple",
  },
  {
    Height: 6.306514509007707,
    Diameter: 0.2692666806586824,
    Family: "apple",
  },
  {
    Height: 5.979720750245472,
    Diameter: 0.4303423671955017,
    Family: "apple",
  },
  {
    Height: 8.501834143773902,
    Diameter: 0.4252007951459287,
    Family: "apple",
  },
  {
    Height: 9.735220833604087,
    Diameter: 0.33803794102265194,
    Family: "apple",
  },
  {
    Height: 9.849267838333237,
    Diameter: 0.3934263382447983,
    Family: "apple",
  },
  {
    Height: 9.82242930026342,
    Diameter: 0.3544905997693495,
    Family: "apple",
  },
  {
    Height: 8.126177454200544,
    Diameter: 0.4158384944385092,
    Family: "apple",
  },
  {
    Height: 7.363172332975688,
    Diameter: 0.4040126228810647,
    Family: "apple",
  },
  {
    Height: 8.092656815557994,
    Diameter: 0.3340260447537869,
    Family: "apple",
  },
  {
    Height: 4.921892414532857,
    Diameter: 0.3017574369773133,
    Family: "apple",
  },
  {
    Height: 7.750236378926506,
    Diameter: 0.3663964609236702,
    Family: "apple",
  },
  {
    Height: 5.732788443606039,
    Diameter: 0.4488555701323009,
    Family: "apple",
  },
  {
    Height: 7.605071013709472,
    Diameter: 0.4097062530380759,
    Family: "apple",
  },
  {
    Height: 5.471691020402937,
    Diameter: 0.2193367411597629,
    Family: "apple",
  },
  {
    Height: 8.410034944656987,
    Diameter: 0.4347781549566119,
    Family: "apple",
  },
  {
    Height: 6.637325469840594,
    Diameter: 0.3843695268210721,
    Family: "apple",
  },
  {
    Height: 4.432164474873146,
    Diameter: 0.4517772834518525,
    Family: "apple",
  },
  {
    Height: 6.194494791064825,
    Diameter: 0.3832607134883349,
    Family: "apple",
  },
  {
    Height: 5.989321892924825,
    Diameter: 0.4710700019892728,
    Family: "apple",
  },
  {
    Height: 8.52220649983437,
    Diameter: 0.2904503960247318,
    Family: "apple",
  },
  {
    Height: 8.98895597681797,
    Diameter: 0.3883776426016339,
    Family: "apple",
  },
  {
    Height: 7.230096142836385,
    Diameter: 0.3135821886374153,
    Family: "apple",
  },
  {
    Height: 7.5010032985521935,
    Diameter: 0.2367375937610627,
    Family: "apple",
  },
  {
    Height: 7.49576305209169,
    Diameter: 0.3475480209305752,
    Family: "apple",
  },
  {
    Height: 8.411007148238344,
    Diameter: 0.3798569219078376,
    Family: "apple",
  },
  {
    Height: 7.212326690968554,
    Diameter: 0.29644675976749674,
    Family: "apple",
  },
  {
    Height: 6.424278009108987,
    Diameter: 0.3750560316196041,
    Family: "apple",
  },
  {
    Height: 6.905481940324154,
    Diameter: 0.3517647873909887,
    Family: "apple",
  },
  {
    Height: 5.378071819273013,
    Diameter: 0.37397028012946376,
    Family: "apple",
  },
  {
    Height: 7.2809848018346655,
    Diameter: 0.35450359943840504,
    Family: "apple",
  },
  {
    Height: 7.204259921203327,
    Diameter: 0.4071277510533611,
    Family: "apple",
  },
  {
    Height: 4.921892414532857,
    Diameter: 0.3017574369773133,
    Family: "apple",
  },
  {
    Height: 6.984723580549742,
    Diameter: 0.41900967381187904,
    Family: "apple",
  },
  {
    Height: 4.958440299138612,
    Diameter: 0.2743102365785393,
    Family: "apple",
  },
  {
    Height: 6.826826364216133,
    Diameter: 0.19568658345953274,
    Family: "cherry",
  },
  {
    Height: 5.065276092143593,
    Diameter: 0.2887589999228476,
    Family: "cherry",
  },
  {
    Height: 4.175110869129972,
    Diameter: 0.2489974288615531,
    Family: "cherry",
  },
  {
    Height: 7.074215361800091,
    Diameter: 0.2401139133631077,
    Family: "cherry",
  },
  {
    Height: 3.504352636035516,
    Diameter: 0.21265902403110112,
    Family: "cherry",
  },
  {
    Height: 3.931601796372556,
    Diameter: 0.19385340552861086,
    Family: "cherry",
  },
  {
    Height: 2.959438941134493,
    Diameter: 0.21101741453335784,
    Family: "cherry",
  },
  {
    Height: 1.3531707739069665,
    Diameter: 0.15202589008824116,
    Family: "cherry",
  },
  {
    Height: 2.9274792177104287,
    Diameter: 0.2371221128734013,
    Family: "cherry",
  },
  {
    Height: 2.073448949712919,
    Diameter: 0.2008115885122318,
    Family: "cherry",
  },
  {
    Height: 3.115585938289557,
    Diameter: 0.2252644818572057,
    Family: "cherry",
  },
  {
    Height: 1.5074707027897296,
    Diameter: 0.1571428571245346,
    Family: "cherry",
  },
  {
    Height: 1.5154725718921578,
    Diameter: 0.11853452060967162,
    Family: "cherry",
  },
  {
    Height: 3.3844347545425566,
    Diameter: 0.2513000434586389,
    Family: "cherry",
  },
  {
    Height: 3.5235809697276257,
    Diameter: 0.19022830439439464,
    Family: "cherry",
  },
  {
    Height: 5.426264791051264,
    Diameter: 0.3139717250649179,
    Family: "cherry",
  },
  {
    Height: 3.94276337443783,
    Diameter: 0.18551767355748724,
    Family: "cherry",
  },
  {
    Height: 2.433817911566308,
    Diameter: 0.04309305046589432,
    Family: "cherry",
  },
  {
    Height: 3.861252157184413,
    Diameter: 0.10801291473337032,
    Family: "cherry",
  },
  {
    Height: 0.3642815418538148,
    Diameter: 0.09476508086494977,
    Family: "cherry",
  },
  {
    Height: 2.2969700138355917,
    Diameter: 0.1982897180086732,
    Family: "cherry",
  },
  {
    Height: 3.8925901160952687,
    Diameter: 0.12751817208343386,
    Family: "cherry",
  },
  {
    Height: 5.4599721608237255,
    Diameter: 0.2340065028283703,
    Family: "cherry",
  },
  {
    Height: 1.9531075997484997,
    Diameter: 0.10051743577828756,
    Family: "cherry",
  },
  {
    Height: 2.773729825320483,
    Diameter: 0.1994289061935656,
    Family: "cherry",
  },
  {
    Height: 3.6782932052493305,
    Diameter: 0.1673273776698777,
    Family: "cherry",
  },
  {
    Height: 5.169407927240174,
    Diameter: 0.2239210950462592,
    Family: "cherry",
  },
  {
    Height: 2.795045914244948,
    Diameter: 0.30311633433841306,
    Family: "cherry",
  },
  {
    Height: 4.841722458402736,
    Diameter: 0.2211556047130321,
    Family: "cherry",
  },
  {
    Height: 3.5725463559332185,
    Diameter: 0.28520802676934315,
    Family: "cherry",
  },
  {
    Height: 3.4137423619915466,
    Diameter: 0.260347239443432,
    Family: "cherry",
  },
  {
    Height: 3.152548047623573,
    Diameter: 0.08844164384204815,
    Family: "cherry",
  },
  {
    Height: 2.4007303551539363,
    Diameter: 0.1182317310962694,
    Family: "cherry",
  },
  {
    Height: 3.4017360151144023,
    Diameter: 0.3047867286857835,
    Family: "cherry",
  },
  {
    Height: 1.905556279838584,
    Diameter: 0.12056707362043716,
    Family: "cherry",
  },
  {
    Height: 3.3759817239673984,
    Diameter: 0.12915788665196262,
    Family: "cherry",
  },
  {
    Height: 2.829831023475418,
    Diameter: 0.1936803347539328,
    Family: "cherry",
  },
  {
    Height: 2.7475307491294645,
    Diameter: 0.18853204879992685,
    Family: "cherry",
  },
  {
    Height: 3.8436354572087694,
    Diameter: 0.2604042284939499,
    Family: "cherry",
  },
  {
    Height: 4.608487593711247,
    Diameter: 0.20136528630476572,
    Family: "cherry",
  },
  {
    Height: 1.964452064584164,
    Diameter: 0.2189140901790427,
    Family: "cherry",
  },
  {
    Height: 5.7468323469296925,
    Diameter: 0.299745004207425,
    Family: "cherry",
  },
  {
    Height: 1.757258093276727,
    Diameter: 0.2000163992318788,
    Family: "cherry",
  },
  {
    Height: 2.5130873186563254,
    Diameter: 0.2269506516773156,
    Family: "cherry",
  },
  {
    Height: 3.927015263919292,
    Diameter: 0.19422445207977626,
    Family: "cherry",
  },
  {
    Height: 2.8472092579223833,
    Diameter: 0.10098289382131112,
    Family: "cherry",
  },
  {
    Height: 4.01046579771699,
    Diameter: 0.1912596593865531,
    Family: "cherry",
  },
  {
    Height: 4.561842693058842,
    Diameter: 0.21209319101039825,
    Family: "cherry",
  },
  {
    Height: 1.921243710658904,
    Diameter: 0.1972398426723843,
    Family: "cherry",
  },
  {
    Height: 2.3807114937249607,
    Diameter: 0.17469612837406315,
    Family: "cherry",
  },
  {
    Height: 8.393851039719372,
    Diameter: 0.4706168851814446,
    Family: "oak",
  },
  {
    Height: 13.0836550644812,
    Diameter: 0.5630717411309293,
    Family: "oak",
  },
  {
    Height: 3.652526786406281,
    Diameter: 0.8572696732141827,
    Family: "oak",
  },
  {
    Height: 10.609924889061622,
    Diameter: 0.8094630719246008,
    Family: "oak",
  },
  {
    Height: 10.766935120680039,
    Diameter: 1.0030103882834824,
    Family: "oak",
  },
  {
    Height: 10.585886155036047,
    Diameter: 0.818702551577114,
    Family: "oak",
  },
  {
    Height: 3.362396467024424,
    Diameter: 0.7441798977354616,
    Family: "oak",
  },
  {
    Height: 3.5773458846406223,
    Diameter: 0.5565087271923822,
    Family: "oak",
  },
  {
    Height: 11.470997466737554,
    Diameter: 0.9434900517744736,
    Family: "oak",
  },
  {
    Height: 7.1340941717084645,
    Diameter: 0.45034198652389534,
    Family: "oak",
  },
  {
    Height: 8.994619858015309,
    Diameter: 0.9651364379507832,
    Family: "oak",
  },
  {
    Height: 11.155333188250728,
    Diameter: 0.7381067384039341,
    Family: "oak",
  },
  {
    Height: 12.003398948581589,
    Diameter: 0.4921529271634439,
    Family: "oak",
  },
  {
    Height: 3.314760353468839,
    Diameter: 0.5527175232488952,
    Family: "oak",
  },
  {
    Height: 6.9525372257303975,
    Diameter: 0.6505191539262914,
    Family: "oak",
  },
  {
    Height: 14.308553948019547,
    Diameter: 0.4595230403418795,
    Family: "oak",
  },
  {
    Height: 5.318455859550399,
    Diameter: 0.6358755271977429,
    Family: "oak",
  },
  {
    Height: 8.994619858015309,
    Diameter: 0.9651364379507832,
    Family: "oak",
  },
  {
    Height: 8.078812414828402,
    Diameter: 0.9282895060879556,
    Family: "oak",
  },
  {
    Height: 4.9547992790837965,
    Diameter: 0.7868729371518406,
    Family: "oak",
  },
  {
    Height: 8.931685913355011,
    Diameter: 0.5205977935304034,
    Family: "oak",
  },
  {
    Height: 5.190725035438217,
    Diameter: 0.5604360140691054,
    Family: "oak",
  },
  {
    Height: 6.360206365465713,
    Diameter: 0.7841339180006817,
    Family: "oak",
  },
  {
    Height: 6.9987725888175145,
    Diameter: 0.87953525916728,
    Family: "oak",
  },
  {
    Height: 6.798935852859628,
    Diameter: 0.4777269986924233,
    Family: "oak",
  },
  {
    Height: 7.319591483488012,
    Diameter: 0.8969869229949456,
    Family: "oak",
  },
  {
    Height: 10.13716832344025,
    Diameter: 0.5038617070681707,
    Family: "oak",
  },
  {
    Height: 3.4394512021969,
    Diameter: 0.5463333491486161,
    Family: "oak",
  },
  {
    Height: 7.688511914462794,
    Diameter: 0.5018764223796339,
    Family: "oak",
  },
  {
    Height: 6.02251194007707,
    Diameter: 0.7468364003689868,
    Family: "oak",
  },
  {
    Height: 3.1136905750870767,
    Diameter: 0.7680268494456803,
    Family: "oak",
  },
  {
    Height: 3.2178521278717245,
    Diameter: 0.6041827152002488,
    Family: "oak",
  },
  {
    Height: 7.820712401319972,
    Diameter: 0.8373904607420403,
    Family: "oak",
  },
  {
    Height: 10.336012182523184,
    Diameter: 0.8864125069166998,
    Family: "oak",
  },
  {
    Height: 14.03734728401795,
    Diameter: 0.6391162313019731,
    Family: "oak",
  },
  {
    Height: 7.068698596298202,
    Diameter: 0.49088943260977796,
    Family: "oak",
  },
  {
    Height: 11.321980826168046,
    Diameter: 0.7892516270462221,
    Family: "oak",
  },
  {
    Height: 11.642967839528112,
    Diameter: 0.5446381743548243,
    Family: "oak",
  },
  {
    Height: 3.685530543208692,
    Diameter: 0.5013497707282457,
    Family: "oak",
  },
  {
    Height: 11.976932228515894,
    Diameter: 0.6774724184486708,
    Family: "oak",
  },
  {
    Height: 11.563539032354994,
    Diameter: 0.5580426173913396,
    Family: "oak",
  },
  {
    Height: 3.3539553088448937,
    Diameter: 0.8054232187468592,
    Family: "oak",
  },
  {
    Height: 10.158280227696151,
    Diameter: 0.9705464856167308,
    Family: "oak",
  },
  {
    Height: 12.172466643630367,
    Diameter: 0.6108372959361905,
    Family: "oak",
  },
  {
    Height: 7.864043672934394,
    Diameter: 0.4706209249845933,
    Family: "oak",
  },
  {
    Height: 12.999214026430275,
    Diameter: 0.9603531223531292,
    Family: "oak",
  },
  {
    Height: 10.13736347650017,
    Diameter: 0.8554993487517485,
    Family: "oak",
  },
  {
    Height: 9.861459738053707,
    Diameter: 0.9749291373360676,
    Family: "oak",
  },
  {
    Height: 9.340502063797416,
    Diameter: 0.5477997053852709,
    Family: "oak",
  },
  {
    Height: 7.2765669488404345,
    Diameter: 0.7063986424618351,
    Family: "oak",
  },
];

const scatterChart = new Scatter({
  chartContainer: "static-chart",
  data: scatterData
});
console.log(scatterData, 'hm')
</script>


<h1 class='body-header'>Responsive, Static Chart Example</h1>
<p class='body-text'>This component is a scope example of a D3 chart.
    It's pretty simple.
</p>
<p class="body-text">
    The entropy can be used to quantify the
    <span class="bold">impurity</span> of a collection of labeled data
    points: a node containing multiple classes is impure whereas a node
    including only one class is pure.
  </p>

  <div id="static-chart"></div>
  <p class="body-text">
    Above, you can compute the entropy of a collection of labeled data
    points belonging to two classes, which is typical for
    <span class="bold">binary classification</span> problems. Click on the
    <span class="bold">Add</span> and
    <span class="bold">Remove</span> buttons to modify the composition of
    the bubble.
  </p>



<style>
    /* sample css to style reactivity button */
    .button-div {
        display: flex;
        justify-content: center;
    }
    button {
        font-family: "Amazon Ember Mono";
        border: 3px solid black;
        padding: 5px 10px;
    }

    #static-chart {
        margin: auto;
        width: 900px;
        height: 600px;
    }
</style>