// 瘟疫公司游戏基础框架
class PlagueGame {
  constructor() {
    this.pathogens = {
      bacteria: {name: '细菌', infectivity: 1, severity: 1, lethality: 1},
      virus: {name: '病毒', infectivity: 2, severity: 1, lethality: 1},
      fungus: {name: '真菌', infectivity: 1, severity: 2, lethality: 1}
    };
    this.world = {
      countries: [],
      population: 0,
      infected: 0,
      dead: 0
    };
    this.evolutionPoints = 0;
  }

  // 初始化世界地图
  initWorld() {
    // 模拟生成国家数据
    this.world.countries = [
      {name: '中国', population: 1400, infected: 0, dead: 0, borders: ['俄罗斯', '印度']},
      {name: '美国', population: 330, infected: 0, dead: 0, borders: ['加拿大', '墨西哥']},
      // 可添加更多国家...
    ];
    this.world.population = this.world.countries.reduce((sum, c) => sum + c.population, 0);
  }

  // 病原体进化
  evolvePathogen(trait, amount) {
    if(this.evolutionPoints >= amount) {
      this.currentPathogen[trait] += amount;
      this.evolutionPoints -= amount;
    }
  }

  // 传播模拟
  simulateSpread() {
    // 感染逻辑
    this.world.countries.forEach(country => {
      if(country.infected > 0) {
        const newInfected = Math.min(
          country.population - country.infected - country.dead,
          Math.floor(country.infected * this.currentPathogen.infectivity * 0.1)
        );
        country.infected += newInfected;
        this.world.infected += newInfected;
        
        // 死亡逻辑
        const newDead = Math.floor(country.infected * this.currentPathogen.lethality * 0.01);
        country.dead += newDead;
        this.world.dead += newDead;
        country.infected -= newDead;
        this.world.infected -= newDead;
      }
    });
    
    // 跨国传播
    this.world.countries.forEach(country => {
      if(country.infected > country.population * 0.3) {
        country.borders.forEach(border => {
          const neighbor = this.world.countries.find(c => c.name === border);
          if(neighbor && neighbor.infected === 0) {
            neighbor.infected = 1;
            this.world.infected += 1;
          }
        });
      }
    });
  }

  // 游戏主循环
  startGame(pathogenType) {
    this.currentPathogen = {...this.pathogens[pathogenType]};
    this.initWorld();
    this.world.countries[0].infected = 1; // 从第一个国家开始感染
    this.world.infected = 1;
    
    // 游戏循环
    setInterval(() => {
      this.evolutionPoints += 1;
      this.simulateSpread();
      
      // 检查胜利条件
      if(this.world.infected + this.world.dead >= this.world.population * 0.99) {
        console.log('胜利！你消灭了全人类！');
      }
      
      // 检查失败条件
      if(this.world.dead >= this.world.population * 0.7) {
        console.log('失败！人类研发出了解药！');
      }
    }, 1000); // 每秒一个回合
  }
}

// 创建游戏实例
const game = new PlagueGame();
game.startGame('virus');