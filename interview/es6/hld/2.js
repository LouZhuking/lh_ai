const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function trafficLight(params) {
  const seq = [
    { color: 'red', time: 1000 },
    { color: 'green', time: 2000 },
    { color: 'yellow', time: 3000 },
  ];

  while (true) {
    for (const { color, time } of seq) {
      console.log(color);
      await sleep(time);
    }
  }
}

trafficLight();
