import React, {useState, useCallback, useRef} from 'react';
import { produce } from 'immer';

import './App.css';
const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]

]
const App: React.FC =() => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), ()=>0));
    }
      
    return rows;
    
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() =>{
    if(!runningRef.current) {
      return;
    }
    //inclue produce to update the state of the grid
    setGrid(g => {
      return produce(g, gridCopy => {
        for(let i = 0; i < numRows; i++){
          for(let j = 0; j < numCols; j++){
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = j + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                  neighbors += g[newI][newK];
              }
          });
          
          if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
          }
    
          }
        }
      })
    })
   
    setTimeout(runSimulation, 250);
  },[]);

  return (
    <>
    <button 
      onClick={() => {
        setRunning(!running);
        //checks whether the simulation was not running before the button was clicked
          if(!running){
            runningRef.current = true;
            runSimulation();

          }
        
      }}
      >
        {running ? "Stop" : "Start"}
        </button>
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${numCols}, 20px)`
  }}>
    {grid.map((rows, i) => 
      rows.map((col,k) => 
        <div 
        key={`${i}-${k}`}
        onClick={() => {
          // use api rather than updating the state in grid[i][k]=1;
          const newGrid = produce(grid, gridCopy => {
            gridCopy[i][k] = grid[i][k] ? 0 : 1;
          })
            setGrid(newGrid);
        }}
        style={{
          width: 20, 
          height: 20, 
          backgroundColor: grid[i][k] ? 'pink' : undefined,
          border:'solid 1px black'
        }}/>)
  )};
</div>
</>
);
};

export default App;


