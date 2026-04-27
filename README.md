# 飞行棋大作战 3D

一款卡通3D风格的飞行棋游戏，支持传统模式和事件模式，2-4名玩家同屏对战。

**在线游玩**: https://yeluo45.github.io/flight-chess-3d/

## 游戏模式

### 传统模式 (Classic)
- 经典飞行棋规则
- 4色棋子（红、蓝、黄、绿）
- 投掷6点起飞，投掷6点获得额外回合
- 踩到对手棋子将其送回起点

### 事件模式 (Event Mode)
- 包含所有传统规则
- 8个特殊事件格：
  - 🌟 幸运格 - 再投一次
  - 💀 厄运格 - 跳过一回合
  - 🔮 传送格 - 前进6格
  - 🔄 交换格 - 与对手交换位置

## 操作说明

1. 选择游戏模式（传统/事件）
2. 选择玩家数量（2-4人）
3. 点击"开始游戏"
4. 点击骰子投掷
5. 点击可移动的棋子进行移动
6. 首个将全部4枚棋子送入终点的玩家获胜

## 技术栈

- React 18 + Vite 5
- Three.js + @react-three/fiber (3D渲染)
- @react-three/drei (3D助手)
- Zustand (状态管理)
- Tailwind CSS 3

## 本地运行

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build
```

构建产物在 `dist/` 目录，推送至 GitHub Pages 即可在线游玩。

## 目录结构

```
src/
├── components/
│   ├── Board/         # 3D棋盘
│   ├── Piece/         # 3D棋子
│   ├── Dice/          # 3D骰子
│   └── UI/            # 游戏界面
├── game/
│   ├── constants.js   # 游戏常量
│   └── store.js       # Zustand状态
└── App.jsx            # 主组件
```

## License

MIT
