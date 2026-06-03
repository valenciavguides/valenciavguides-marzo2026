import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-chino-simplificado.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "40": "<p>在您的地图上对应编号<mark>28</mark>。</p>",
  "40-B": "<p>此空间在您的地图上对应编号<mark>28</mark>。</p>",
  "41": "<p>在您的地图上对应编号<mark>29</mark>。</p>",
  "42": "<p>在您的地图上对应编号<mark>30</mark>。</p>",
  "43": "<p><strong>Palacio del Marqués de Dos Aguas</strong>在您的地图上对应编号<mark>31</mark>。</p>",
  "43-B": "<p>在您的地图上对应编号<mark>31</mark>。</p>",
  "44": "<p>在您的地图上对应编号<mark>32</mark>。</p>",
  "44-B": `<p>请前往大教堂罗曼式风格的门廊，在地图上对应编号<mark>32</mark>，途中请向左上方看。</p>\n<p>15世纪末的一座八边形塔楼从大教堂后方探出。</p>`,
  "45": "<p>您的探险将继续前往地图编号<mark>33</mark>的建筑。</p>",
  "45-B": `<p>欣赏<strong>Catedral de Valencia</strong>最古老的门廊，请将目光转向其北立面。</p>\n<p>您可以从右侧的Plaza de la Almoina全面欣赏其风采。</p>\n<p>请走到广场中央。在您的地图上对应编号<mark>33</mark>。</p>`,
  "45-C": "<p>您的探险在此处继续，在您的地图上对应编号<mark>33</mark>。</p>",
  "45-D": "<p>请站到地图<mark>33</mark>号标注的广场中央，从那里可以看到直径约19米的椭圆形圣殿穹顶的一部分。</p>",
  "45-E": "<p>在您的地图上对应编号<mark>33</mark>。</p>",
  "45-F": "<p>在您的地图上对应编号<mark>33</mark>。</p>",
  "46": "<p>在您的地图上对应编号<mark>34</mark>。</p>",
  "46-B": "<p>在您的地图上对应编号<mark>34</mark>。</p>",
  "47": "<p>在您的地图上对应编号<mark>35</mark>。</p>",
  "47-B": "<p>在您的地图上对应编号<mark>35</mark>。这将是您的最后一站。</p>",
  "48": "<p>在您的地图上对应编号<mark>39</mark>。</p>",
  "48-B": `<p>以Santa Catalina塔楼为正面，如方便请向右侧看。</p>\n<p>请将注意力集中在广场深处，您的下一个目标是著名的<strong>Miguelete</strong>，它从大教堂后方探出。</p>\n<p>这座秀美的观景台在您的地图上对应编号<mark>39</mark>。您能看到它吗？</p>`,
  "49": `<p>请按地图路线，以大教堂正立面在左侧的方向绕行大教堂。</p>\n<p>换句话说，以巴洛克式大教堂门廊为正面，向右转，继续走到罗曼式大门处。</p>\n<p>在您的地图上对应编号<mark>40</mark>。</p>\n<p>请按暂停键，前往或查看指示地点，到达建议地点后请再次按继续键。谢谢。</p>`,
  "49-B": `<p>请再次将注意力集中在<strong>Catedral de Valencia</strong>，地图编号<mark>40</mark>。</p>`,
  "50": "<p>在您的地图上对应编号<mark>41</mark>。</p>",
  "51": "<p>请站到地图<mark>42</mark>号标注的广场中央，从那里可以看到宽约19米的椭圆形圣殿穹顶的一部分。</p>",
  "51-B": "<p>您的探险在此处继续，在您的地图上对应编号<mark>42</mark>。</p>",
  "51-C": "<p>请站到地图<mark>4</mark>号标注的广场中央，从那里可以看到宽约19米的椭圆形圣殿穹顶的一部分。</p>",
  "51-D": "<p>在您的地图上对应编号<mark>42</mark>。</p>",
  "52": `<p>请继续沿街道前行，若您尚未被诱惑所动，请注意左手边地图<mark>2</mark>号标注的一座重要建筑。</p>\n<p>这座建筑名为<strong>Les Corts Valencianes</strong>。</p>\n<p>这是一座晚期哥特式风格的建筑，如今用于政府活动，历史上曾是博吉亚家族在瓦伦西亚期间的住所。</p>`,
  "53": "<p>您现在在<strong>Plaza del Tossal</strong>吗？是的？太好了！在您的地图上对应编号<mark>49</mark>。</p>",
  "54": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，进入此空间欣赏展览。您可在认为合适的时候继续探险。</p>`,
  "54-B": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，进入此空间欣赏展览。您可在认为合适的时候继续探险。</p>`,
  "55": `<p>${LOGO}建议您暂停本语音导览，按自己的节奏漫步于此花园中。</p>`,
  "56": `<p>若在开放时间内到访，${LOGO}建议您暂停本语音导览，按自己的节奏漫步于此花园中。</p>`,
  "57": "<p>请随时使用暂停键。当您感到时机合适时，只需继续解答我们的挑战，边游览城市边探索。</p>",
  "58": "<p>请按您的喜好使用暂停和继续键来随时停止和恢复您<i>寻找宝藏</i>的探险。您可在感到时机合适时随时回到探险，只需按继续键即可。</p>",
  "59": "<p>在您的地图上对应编号<mark>43</mark>。</p>",
  "60": `<p>欣赏大教堂哥特式门廊时，您的下一个目标在广场对面矗立。</p>\n<p>请转身，您将看到对面一座用石灰岩砌成、与周围城市景观截然不同的宫殿。</p>\n<p>请不要暂停本语音导览，按地图指示前往下一个景点。</p>\n<p>在您的地图上对应编号<mark>44</mark>。</p>`,
  "61": `<p>${LOGO}建议您短暂停顿，环顾四周。</p>`,
  "62": `<p>${LOGO}建议您短暂停顿，环顾四周。</p>`,
  "63": "<p>在您的地图上对应编号<mark>47</mark>。</p>",
  "64": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观这个文化中心。</p>`,
  "64-B": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观这个文化中心。</p>`,
  "65": "<p>在您的地图上对应编号<mark>49</mark>。</p>",
  "66": "<p>在您的地图上对应编号<mark>50</mark>。</p>",
  "67": "<p>在您的地图上对应编号<mark>51</mark>。</p>",
  "68": `<p>您知道这条街的名字吗？</p>\n<p>请按暂停键，查看指示地点并解答您的挑战，到达建议地点后请再次按继续键。</p>`,
  "69": "<p>此次探险的下一个目标在地图上对应编号<mark>53</mark>。</p>",
  "70": `<p>${LOGO}将在本次探险过程中为您提供关于这一节庆的详细信息。</p>`,
  "71": "<p>在您的地图上对应编号<mark>54</mark>。</p>",
  "72": "<p>在您的地图上对应编号<mark>55</mark>。</p>",
  "73": "<p>在您的地图上对应编号<mark>56</mark>。</p>",
  "74": "<p>此次探险中您的下一个景点在地图上对应编号<mark>57</mark>。</p>",
  "75": `<p>${LOGO}建议您从此处开始步行。</p>\n<p>请查看地图，它提示您沿城墙遗址前行。</p>\n<p>以IVAM正门为正面，向右转。左侧仅两条街之外有三个连续景点等待您。</p>\n<p>在地图上依次对应编号<mark>58</mark>、<mark>59</mark>和<mark>60</mark>。</p>\n<p>请按暂停键，前往或查看指示地点，到达建议地点后请再次按继续键。谢谢。</p>`,
  "76": `<p>请返回原始城墙遗址，向左前行。几米后，著名的<strong>Torres de Quart</strong>便出现在眼前，地图编号<mark>61</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。谢谢。</p>`,
  "76-B": `<p>您的探险将带您回到著名的<strong>Torres de Quart</strong>，地图编号<mark>61</mark>。</p>\n<p>请走上为个人出行车辆设计的同一条道路，沿城墙遗址返回古城入口。</p>\n<p>请按暂停键，前往或查看指示地点，到达建议地点后请再次按继续键。谢谢。</p>`,
  "77": `<p>以<strong>Torres de Quart</strong>为背，穿过大道，走上左侧适行车道，前往本次探险的下一个景点。走过几条街后，左手边可见一处园林区，地图编号<mark>62</mark>。</p>\n<p>请遵守交通规则！这条为个人出行车辆设置的专用道沿瓦伦西亚古城墙遗址延伸。</p>\n<p>请按暂停键，前往或查看指示地点，到达建议地点后请再次按继续键。谢谢。</p>`,
  "78": "<p>在您的地图上对应编号<mark>63</mark>。</p>",
  "79": "<p>在您的地图上对应编号<mark>69</mark>。</p>",
  "80": "<p>请前往下一个景点，地图编号<mark>70</mark>。请按暂停键，前往指示地点，到达建议地点后请再次按继续键。谢谢。</p>",
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
