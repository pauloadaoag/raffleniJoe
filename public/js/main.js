var attendeeList = [ "Iris Endozo", "MJ Madelo", "Kat Yutoc", "Gary Villame", "Joe Bautista", "Danel Beriong", "Jhong Molina", "Alay Magno", "Roy Flores", "Pau Adaoag", "Mark Manalansang", "Diet Flores", "Erika Aranas", "Roman Balayan" ];
var delay = 100; //delay in milliseconds
var counter = 0; // counter to detect time elapsed
var duration = 3; // duration of each raffle
var myTimer;
var winnerName = 'Joe Bautista';
var firstName = 'Joe';
var surName = 'Bautista';
var version = 2;
var confettiInterval;
var airportTimer;
var W; // window width
var H; // window height
// airport plugin option

var socket = io.connect('http://localhost');
socket.on('start-draw', function (data) {
    pickWinner(data);
});

var opts = {
    chars_preset: 'alphanum',
    align: 'left',
    width: 15,
    timing: 100,
    //min_timing: 300
};
    
$(document).ready(function(){
    fetchDB();
    $(document).keypress(function(e) {
        if(e.which == 13) {
            pickWinner();
        }
    })

    W = window.innerWidth;
    H = window.innerHeight;

    if(version == 1)
    {
        document.getElementById('name').style.visibility = 'visibile';
        document.getElementById('firstname').style.visibility = 'hidden';
        document.getElementById('airportdiv').style.visibility = 'hidden';
    }
    else
    {
        document.getElementById('name').style.visibility = 'hidden';
        document.getElementById('firstname').style.visibility = 'visible';
        document.getElementById('airportdiv').style.visibility = 'visible';
    }
    
    $('input.display').flapper(opts);

    $("#drums").jPlayer({
        swfPath: "/Jplayer.swf",
        wmode: "window"
    });

    $('#drums').jPlayer("setMedia", {mp3:"/drumroll.mp3"});
    $('#drums').jPlayer("supplied", "mp3");
    
    $("#applause").jPlayer({
        swfPath: "/Jplayer.swf",
        wmode: "window"
    });

    $('#applause').jPlayer("setMedia", {mp3:"/applause-1.mp3"});
    $('#applause').jPlayer("supplied", "mp3");
    /* Make <canvas> the background of the document */
    var canvas = $("canvas");
    var ctx = canvas[0].getContext("2d"),
    width = $(document).width(),
    height = $(document).height(), a, b;
    canvas.attr("width", width);
    canvas.attr("height", height);

});

function startConfetti() {
    // code as seen from http://jsfiddle.net/vxP5q/

    // initialize canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // initialize dimensions
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // confetti particles
    var mp = 300; //max particles
    var particles = [];
    for(var i = 0; i < mp; i++)
    {
        particles.push({
            x: Math.random()*W, //x-coordinate
            y: Math.random()*H, //y-coordinate
            //r: Math.random()*4+1, //radius
            //d: Math.random()*mp, //density
            width: Math.random()*9+1,
            height: Math.random()*9+1,
            color: "rgba(" + Math.floor((Math.random() * 255)) +", " + Math.floor((Math.random() * 255)) +", " + Math.floor((Math.random() * 255)) + ", 0.8)"
        })
    }

    // drawing flakes
    function draw()
    {
        ctx.clearRect(0, 0, W, H);

        for(var i = 0; i < mp; i++)
        { 
            var p = particles[i];
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.moveTo(p.x, p.y);
            //ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
            ctx.fillRect(p.x,p.y,p.width,p.height);
            ctx.fill();
        }

        update();
    }

    // moving snowflakes
    var angle = 0;
    function update()
    {
        angle += 0.01;
        for(var i = 0; i < mp; i++)
        {
            var p = particles[i];
            //p.y += Math.cos(angle+p.d) + 1 + p.r/2;
            //p.x += Math.sin(angle) * 2;
            p.y += Math.cos(angle+p.height) + 1 + p.width/2;
            p.x += Math.sin(angle) * 2;

            // sending flakes back from the top when it exits
            if(p.x > W+5 || p.x < -5 || p.y > H)
            {
                if(i%3 > 0) //66.67% of the flakes
                {
                    //particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d, color : p.color};
                    particles[i] = {x: Math.random()*W, y: -10, width: p.width, height: p.height, color: p.color};
                }
                else
                {
                    //If the flake is exitting from the right
                    if(Math.sin(angle) > 0)
                    {
                        //Enter from the left
                        //particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d, color: p.color};
                        particles[i] = {x: -5, y: Math.random()*H, width: p.width, height: p.height, color: p.color};
                    }
                    else
                    {
                        //Enter from the right
                        //particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d, color : p.color};
                        particles[i] = {x: W+5, y: Math.random()*H, width: p.width, height: p.height, color : p.color};
                    }
                }
            }
        }
    }

    // animation loop
    confettiInterval = setInterval(draw, 33);
};

var participants = [];



function fetchDB() {
    var request = $.ajax({
        method: "POST",
        url: "/fetchdb",
    }).done(function(msg) { 
        msg.forEach(function(member, index) {
            member.won = false;
            participants.push(member);
        });
    });   
};

function pickWinner(){
    var maybankregex = /maybank/i;
    participants = participants.filter(function(a){return (!a.won)});
    participants = participants.filter(function(a){return !(maybankregex.test(a.COMPANYNAME))});
    if(version == 1)
    {
        
        document.getElementById('congrats').style.visibility = 'hidden';
        document.getElementById('name').style.visibility = 'visible';
        // document.getElementById('picker').style.visibility = 'hidden';
    
        // $('#drums').jPlayer("play");
        // $('#applause').jPlayer("stop");
        myTimer = setInterval(pickName, delay);
    }
    else // AIRPORT VERSION
    {
        // make necessary elements hidden
        document.getElementById('congrats').style.visibility = 'hidden';
        // document.getElementById('picker').style.visibility = 'hidden';
        // clear confetti - supposedly
        document.getElementById('canvas').getContext("2d").clearRect(0,0,W,H);
        // $('#drums').jPlayer("play");
        // $('#applause').jPlayer("stop");
         
        airportTimer = setInterval(airportStyle, 500); // one person in chosen, shown after 10 secs
    }
};

function airportStyle(){
        counter++;
        if(counter==20) //end of first run
        {
            clearInterval(airportTimer);
            increment = 0;
            counter = 0;
            //$('#company').text(totoongWinner.company);
            startConfetti();
            // $('#drums').jPlayer("stop");
            // $('#applause').jPlayer("play");
            // document.getElementById('picker').style.visibility = 'visible';
            document.getElementById('congrats').style.visibility = 'visible';
            (participants[totoongWinner.index]).won = true;;
            socket.emit('new-winner',totoongWinner);
        }
        else
        {

            document.getElementById('canvas').getContext("2d").clearRect(0,0,W,H);
            clearInterval(confettiInterval);
            //choose winner
            if(counter<19)
            {
                var max = participants.length-1;
                var min = 0;
                var randNum = Math.floor(Math.random() * (max - min + 1) + min);
                // while(participants[randNum].won){
                //     randNum = Math.floor(Math.random() * (max - min + 1) + min);
                // }
                $('#firstname').val((participants[randNum].FIRSTNAME).toUpperCase()).change();
                $('#surname').val((participants[randNum].LASTNAME).toUpperCase()).change();
                $('#company').val((participants[randNum].COMPANYNAME).toUpperCase()).change();
                totoongWinner = participants[randNum];
                totoongWinner.index = randNum;
            }
        }
}

var totoongWinner = {};
