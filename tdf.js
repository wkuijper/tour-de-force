// create main canvas

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

// set up resize listeners

window.onresize = (evt) => {
    console.log(`onresize: ${evt}`);
    window.requestAnimationFrame(animationFrame);
}

//  main animation function resizes canvas if necesary

window.requestAnimationFrame(animationFrame);

let lastTimeStamp;

function animationFrame(timeStamp) {
    if (lastTimeStamp === undefined) {
        lastTimeStamp = timeStamp;
        window.requestAnimationFrame(animationFrame);
        return;
    }
    const timeElapsed = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;    
    const width = window.innerWidth;
    if (canvas.width !== width) {
        canvas.width = width;
    }
    const height = window.innerHeight;
    if (canvas.height !== height) {
        canvas.height = height;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, (Math.min(width, height)/8) + ((Math.min(width, height)/16) * Math.sin(timeStamp / 500)), 0, 2 * Math.PI);
    ctx.fill();
}
