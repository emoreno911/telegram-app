import React, { useRef, useEffect } from 'react';

interface CanvasProgressBarProps {
  progress: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

function generateSineWave(sampleCount:number, frequency:number, amplitude = 1, phase = 0) {
  const sineWave = [];
  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleCount;
    const value = amplitude * Math.sin(2 * Math.PI * frequency * t + phase);
    sineWave.push(value);
  }
  return sineWave;
}

let aframe: number;
let phase: number = 0;

const CanvasProgressBar: React.FC<CanvasProgressBarProps> = ({
  progress,
  width = 300,
  height = 20,
  backgroundColor = '#e0e0e0',
  fillColor = '#4caf50'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef(0);

  useEffect(() => {
    update();

    return () => {
        console.log("stopped!!!")
        window.cancelAnimationFrame(aframe)
    }
  }, []);

  useEffect(() => {
    divRef.current = progress
  }, [progress])

  const update = () => {
    aframe = window.requestAnimationFrame(update);
    const progress = divRef.current;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, height);

    // Draw background rectangle
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, height);

    // Draw progress rectangle
    // ctx.fillStyle = fillColor;
    // const progressWidth = (progress / 100) * width;
    // ctx.fillRect(0, 0, progressWidth, height);

    let bars = 75;
    ctx.fillStyle = "rgb(219 39 119)"; // Color of the bars

    let currentPercent = Math.floor(progress*bars/100);
    let fbc_array = generateSineWave(75, 2, -5, -1*phase);
    
    phase += 0.1

    for (let i = 0; i < bars; i++) {
        if(i > currentPercent)
            ctx.fillStyle = "#bbb";

        let bar_x = i * 4;
        let bar_width = 3.5;
        let bar_height = -1 * ((fbc_array[i]) + 14);
        ctx.fillRect(bar_x, 20, bar_width, bar_height);
    }
  }

  return (
    <div className="relative z-10 h-5 w-full h-8">
      <canvas
        ref={canvasRef}
        // width={width}
        height={height}
        className="border border-gray-300 rounded w-full h-full"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
      <span className="sr-only">{`${progress}% complete`}</span>
    </div>
  );
};

export default CanvasProgressBar;